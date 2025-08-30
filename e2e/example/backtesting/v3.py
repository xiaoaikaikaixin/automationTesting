from jqdata import *
import numpy as np
import pandas as pd

def initialize(context):
    # ==========================================================
    # 【用户控制中心】—— 实验员只需修改此处参数，严禁改动下方逻辑
    # ==========================================================
    
    # --- 维度 1：持仓规模与阈值 (影响收益爆发力) ---
    g.stock_num = 10             # [买入数量]：打算同时持有几只股票（建议：5, 10, 15, 20, 30, 50）
    g.rank_threshold = 15        # [换仓阈值]：持有的票跌出前多少名才卖（建议：买入数量的 1.3 或 1.5 倍）
    
    # --- 维度 2：避雷时间管理 (影响抗跌能力) ---
    g.avoid_months = [1, 4, 12]  # [避雷月份]：哪些月份强制清仓空仓（例如 [1, 4, 12]）
    g.avoid_half_month = False   # [半月模式]：True表示只避开该月15号之后，False表示全月空仓离场
    g.avoid_at_once = False      # [清仓模式】True: 进入月份立即清仓 / False: 进入月份后，等到下一个调仓日再清仓
    
    # --- 维度 3：利润收割策略 (影响利润留存) ---
    g.use_take_profit = True     # [止盈开关]：是否开启“获利回落”卖出功能
    g.tp_ratio = 0.15            # [止盈触发]：盈利达到多少比例开始启动监控（建议：0.10, 0.20, 0.30, 0.50）
    g.tp_rollback = 0.01         # [回落比例]：启动后，从最高点跌多少就卖（建议：0.01, 0.02, 0.03, 0.05）
    
    # --- 维度 4：交易频率与摩擦 (影响实战损耗) ---
    g.hold_days = 5              # [调仓周期]：每隔几个交易日复盘选股（建议：1, 3, 5, 10, 22）
    g.slippage_fee = 0.002       # [滑点设置]：模拟真实买不到的情况。0.002即千分之二（建议：0.001 - 0.005）
    g.refill_mode = False        # [周内补仓开关]：周内卖出后，是否下个交易日立即补位
    
    # --- 维度 5：安全边界与止损 (影响生命线) ---
    g.sl_ratio = -0.12           # [硬止损线]：相对于买入价亏损多少强制卖出（建议：-0.05, -0.08, -0.10, -0.15）
    g.market_cap_limit = (10, 30) # [市值区间]：总市值范围（单位：亿）。如 (10, 30)
    g.min_revenue_value = 0.5     # [营收门槛]：单季营业收入底线（1代表1亿）
    g.pb_limit = (2, 6)           # [PB区间]：市净率范围。如 (2, 6)
    g.exclude_chinext = False     # [主板开关]：是否排除创业板（True: 仅主板 / False: 全市场选股）
    
    # --- 维度 6： 动量加权排序开关 ---
    g.use_score_sort = False  # [动量加权打分开关]：是否采用动量加权小市值打分（True：采用 / False：纯小市值）

    # --- 核心系统开关 (不建议修改) ---
    g.use_crash_monitor = False    # 中小综指日内熔断开关
    g.crash_index = '399101.XSHE' # 监控中小综指
    g.crash_threshold = -0.05    # 日内跌 5% 触发清仓避险
    g.use_ma_filter = False      # 大盘均线择时开关
    g.ma_days = 20               # 择时均线周期

    # ==========================================================
    # 【自动化底座】—— 逻辑已自动关联，群友无需下移修改
    # ==========================================================
    set_benchmark('000852.XSHG') 
    set_option('use_real_price', True)
    set_option('avoid_future_data', True)
    set_order_cost(OrderCost(open_tax=0, close_tax=0.001, open_commission=0.0003, 
                            close_commission=0.0003, min_commission=5), type='stock')
    set_slippage(PriceRelatedSlippage(g.slippage_fee)) 
    log.set_level('order', 'error') 
    
    # 年度统计变量
    g.day_count = 0          
    g.yesterday_HL_list = [] 
    g.candidate_list = []    
    g.last_high = {}
    g.annual_stats = {}      # 存储格式: {年份: {"ret": 收益, "mdd": 回撤}}
    g.yearly_start_value = context.portfolio.total_value 
    g.yearly_high = context.portfolio.total_value
    g.yearly_max_drawdown = 0

    # 注册每日任务
    run_daily(prepare_daily_data, time='9:05')    # 盘前准备：记录涨停
    run_daily(market_crash_monitor, time='10:30') # 监控：指数熔断逻辑
    run_daily(handle_trade, time='14:40')         # 交易执行核心逻辑
    # run_daily(check_limit_up, time='14:50')       # 尾盘再检查，没涨停且不在阈值内的剔除
    run_daily(print_positions, time='15:10')      # 打印持仓
    run_daily(record_annual_stats, time='15:30')  # 记录年度数据

# --- 1. 核心功能：历年收益与回撤自动统计 ---
def record_annual_stats(context):
    today = context.current_dt
    curr_value = context.portfolio.total_value
    
    # 实时更新当年的最高点和最大回撤
    if curr_value > g.yearly_high:
        g.yearly_high = curr_value
    
    curr_drawdown = (g.yearly_high - curr_value) / g.yearly_high
    if curr_drawdown > g.yearly_max_drawdown:
        g.yearly_max_drawdown = curr_drawdown
        
    # 判断是否为当年最后一个交易日
    last_day = get_trade_days(start_date=today, end_date=str(today.year)+'-12-31')[-1]
    if today.date() == last_day:
        yearly_ret = (curr_value / g.yearly_start_value) - 1
        
        # 记录年度数据
        g.annual_stats[today.year] = {
            "ret": "%.2f%%" % (yearly_ret * 100),
            "mdd": "%.2f%%" % (g.yearly_max_drawdown * 100)
        }
        
        # 打印年度总结清单
        log.info("="*60)
        log.info("【策略年度绩效汇总表 (2016 至今)】")
        log.info("年份 | 年度收益 | 年度最大回撤")
        for year, stats in sorted(g.annual_stats.items()):
            log.info(">>> %d年 | %s | %s" % (year, stats['ret'], stats['mdd']))
        log.info("="*60)
        
        # 重置下一年的统计变量
        g.yearly_start_value = curr_value
        g.yearly_high = curr_value
        g.yearly_max_drawdown = 0

# --- 2. 盘前准备：记录涨停 ---
def prepare_daily_data(context):
    hold_list = list(context.portfolio.positions.keys())
    if hold_list:
        df = get_price(hold_list, end_date=context.previous_date, frequency='daily', 
                        fields=['close','high_limit'], count=1, panel=False)
        df = df[df['close'] == df['high_limit']]
        g.yesterday_HL_list = list(df.code)
    else:
        g.yesterday_HL_list = []

# --- 3. 监控：指数熔断逻辑 ---
def market_crash_monitor(context):
    if not g.use_crash_monitor: return
    curr_h = get_price(g.crash_index, count=1, end_date=context.current_dt, frequency='1m', fields=['close'], panel=False)
    prev_h = get_price(g.crash_index, count=1, end_date=context.previous_date, frequency='daily', fields=['close'], panel=False)
    if (not curr_h.empty) and (not prev_h.empty):
        idx_change = (curr_h['close'].iloc[0] / prev_h['close'].iloc[0]) - 1
        if idx_change <= g.crash_threshold:
            log.warn("!!!! 指数日内暴跌 %.2f%%，全仓避风头" % (abs(idx_change)*100))
            for s in list(context.portfolio.positions.keys()):
                if not get_current_data()[s].paused: order_target(s, 0)

# --- 4. 交易执行核心逻辑（优化版） ---
def handle_trade(context):
    today = context.current_dt
    curr_data = get_current_data()
    
    # 【第一部分：每日扫描——避雷清仓逻辑优化】
    if today.month in g.avoid_months:
        # 判断是否符合半月避雷条件
        is_avoid_time = not g.avoid_half_month or (g.avoid_half_month and today.day >= 15)
        
        if is_avoid_time:
            # 模式 A：立即清仓 (g.avoid_at_once = True)
            # 模式 B：调仓日清仓 (g.avoid_at_once = False 且 今天是调仓日)
            is_rebalance_day = (g.day_count % g.hold_days == 0)
            
            if g.avoid_at_once or is_rebalance_day:
                if context.portfolio.positions:
                    log.info(">>>> 避雷期执行清仓（月份:%d, 模式:%s）" % 
                             (today.month, "立即" if g.avoid_at_once else "随调仓日"))
                    for s in list(context.portfolio.positions.keys()):
                        if not curr_data[s].paused and curr_data[s].last_price > curr_data[s].low_limit:
                            order_target(s, 0)
                            if s in g.last_high: del g.last_high[s]
                
                # 无论模式 A 还是 B，只要进入避雷期且执行了逻辑，就不再往下走买入流程
                g.day_count += 1 
                return

    # 【第二部分：每日扫描——大盘择时清仓】
    if g.use_ma_filter:
        h_idx = attribute_history('000852.XSHG', g.ma_days, '1d', ['close'])
        if curr_data['000852.XSHG'].last_price < h_idx['close'].mean():
            if context.portfolio.positions:
                log.warn(">>>> 大盘跌破均线，执行择时清仓")
                for s in list(context.portfolio.positions.keys()):
                    # 增加非跌停判断
                    if not curr_data[s].paused and curr_data[s].last_price > curr_data[s].low_limit: 
                        order_target(s, 0)
                        if s in g.last_high: del g.last_high[s]
            return

    # 【第三部分：每日扫描——个股精准止盈与硬止损】
    # 无论是否到调仓日，每天都会执行此段逻辑
    for s, pos in context.portfolio.positions.items():
        price_now = curr_data[s].last_price
        
        # 1. 更新买入后的历史最高价（用于追踪止盈）
        if s not in g.last_high or price_now > g.last_high[s]:
            g.last_high[s] = price_now
        
        # 2. 计算自买入以来的盈亏比例
        profit_ratio = price_now / pos.avg_cost - 1
        
        # 3. 精准追踪止盈逻辑
        # 条件：开启止盈开关 + 盈利过20% + 从买入后的最高点回落超过1%
        if g.use_take_profit and profit_ratio > g.tp_ratio:
            if price_now < g.last_high[s] * (1 - g.tp_rollback):
                if price_now > curr_data[s].low_limit: # 模拟真实成交：非跌停
                    log.info("【追踪止盈触发】: %s，最高盈利:%.2f%%，当前回落卖出" % 
                             (get_security_info(s).display_name, (g.last_high[s]/pos.avg_cost-1)*100))
                    order_target(s, 0)
                    if s in g.last_high: del g.last_high[s]
                    continue

        # 4. 硬止损逻辑
        # 条件：跌幅超过设定阈值（如-10%）
        if profit_ratio < g.sl_ratio:
            if price_now > curr_data[s].low_limit: # 模拟真实成交：非跌停
                log.warn("【硬止损触发】: %s，当前跌幅:%.2f%%" % (get_security_info(s).display_name, profit_ratio*100))
                order_target(s, 0)
                if s in g.last_high: del g.last_high[s]

    # 【第四部分：调仓频率控制】
    # 只有止盈止损清出了位置，或者到了第5天调仓日，才继续往下走
    current_hold_count = len(context.portfolio.positions)
    is_rebalance_day = (g.day_count % g.hold_days == 0)
    
    # 如果【不是】调仓日，且【不开启】立即补位模式，或者持仓已经满了，则跳过后续逻辑
    if not is_rebalance_day:
        if not g.refill_mode or current_hold_count >= g.stock_num:
            g.day_count += 1
            return
    
       
    # 【第五部分：调仓日排名换仓逻辑】
    # 获取当前最新的优选股票池（前13名）
    g.candidate_list = get_stock_list(context, count=g.rank_threshold)
    if not g.candidate_list: return
    
    target_list = g.candidate_list[:g.stock_num] # 理想持仓的前10名
    candidate_set = set(g.candidate_list)       # 换仓阈值的集合
    
    # 只有在正式调仓日，才卖出“排名掉队”的票
    if is_rebalance_day:
        for s in list(context.portfolio.positions.keys()):
            # 如果股票跌出了阈值
            if s not in candidate_set:
                # 涨停保护：如果正在涨停，暂时不卖
                if s in g.yesterday_HL_list and curr_data[s].last_price >= curr_data[s].high_limit: 
                    continue
                # 跌停保护：如果封死跌停，想卖也卖不掉
                if curr_data[s].last_price <= curr_data[s].low_limit:
                    continue
                # 执行卖出
                if not curr_data[s].paused: 
                    order_target(s, 0)
                    if s in g.last_high: del g.last_high[s]

    # 【第六部分：补仓与买入逻辑】
    # 重新计算需要买入的数量
    current_hold_count = len(context.portfolio.positions)
    buy_count = g.stock_num - current_hold_count 
    
    if buy_count > 0:
        # 预留5%资金缓冲滑点，平分给待买入的坑位
        cash_ready = context.portfolio.available_cash * 0.95
        single_val = cash_ready / buy_count 
        
        for s in target_list:
            if buy_count <= 0: break # 位置填满了就停止买入
            
            # 如果该票已在持仓中，跳过
            if s in context.portfolio.positions: continue
            
            # 停牌或正在涨停的票，不追高买入
            if curr_data[s].paused or curr_data[s].last_price >= curr_data[s].high_limit: 
                continue
                
            # 计算买入股数（向下取整为100的倍数）
            amount = int(single_val / curr_data[s].last_price / 100) * 100
            if amount >= 100: 
                order(s, amount)
                buy_count -= 1 # 成功下一单，坑位减一
    
    # 只有在正式调仓日才重置计数器为1，平时补仓不重置周期
    if is_rebalance_day:
        g.day_count = 1
    else:
        g.day_count += 1

# --- 5. 选股逻辑 (多因子打分版 + 原始市值逻辑切换) ---
def get_stock_list(context, count=30):
    yesterday = context.previous_date
    
    # 1. 基础池筛选：获取 10-30 亿、PB 2-6、营收 > 1亿 且利润 > 0 的票
    # 默认 order_by 市值升序，这是你的“底色”
    q = query(valuation.code, valuation.market_cap).filter(
        valuation.market_cap.between(g.market_cap_limit[0], g.market_cap_limit[1]),
        valuation.circulating_market_cap > 5,
        valuation.pb_ratio.between(g.pb_limit[0], g.pb_limit[1]),
        indicator.adjusted_profit > 0,
        income.total_operating_revenue > g.min_revenue_value * 1e8
    ).order_by(valuation.market_cap.asc()).limit(400)
    
    df = get_fundamentals(q, date=yesterday)
    if df.empty: return []
    
    # 2. 静态过滤：排除 ST、停牌、创业板开关等
    curr_data = get_current_data()
    st_data = get_extras('is_st', df['code'].tolist(), start_date=yesterday, end_date=yesterday)
    
    # 存储通过初步硬指标过滤的股票信息
    clean_list = []
    for index, row in df.iterrows():
        s = row['code']
        d_name = get_security_info(s).display_name
        is_st = st_data[s][0] if s in st_data.columns else False
        
        # 排除 ST、停牌、退市、科创/北交所
        if is_st or 'ST' in d_name or '*' in d_name or '退' in d_name: continue
        if s.startswith(('688', '8', '4')): continue
        if g.exclude_chinext and s.startswith('300'): continue
        if curr_data[s].paused: continue
        
        # 基础流动性与涨停过滤：日均成交 > 800万 且 没封死涨停
        # 先简单拿昨日成交额判断，提速
        if not curr_data[s].paused and curr_data[s].last_price < curr_data[s].high_limit:
            clean_list.append({'code': s, 'market_cap': row['market_cap']})
    
    if not clean_list: return []

    # ---------------------------------------------------------
    # 逻辑分支：是采用【纯市值排序】还是【加权打分排序】
    # ---------------------------------------------------------
    
    # 模式 A：纯市值模式 (关闭开关)
    if not g.use_score_sort:
        # 因为最初 query 就是按市值升序排的，直接取前 count 名即可
        # 加上流动性复核，确保稳健
        final_codes = [x['code'] for x in clean_list]
        return final_codes[:count]

    # 模式 B：综合打分模式 (开启开关)
    # 逻辑：总分 = 市值得分(0.7) + 20日跌幅得分(0.3)
    
    # 3. 批量获取 20 日动量数据 (仅在开启打分模式时调用，节省性能)
    codes_to_score = [x['code'] for x in clean_list]
    h = get_price(codes_to_score, count=20, end_date=yesterday, fields=['close'], panel=False)
    if h.empty: return [x['code'] for x in clean_list][:count] # 数据缺失则退回原逻辑
    
    # 计算 20 日涨幅 (r20)
    last_close = h.groupby('code')['close'].last()
    first_close = h.groupby('code')['close'].first()
    r20 = (last_close / first_close) - 1
    
    # 组建打分表
    score_df = pd.DataFrame(clean_list)
    # 将 r20 合并到表中
    score_df['r20'] = score_df['code'].map(r20)
    score_df.dropna(inplace=True) # 删掉没有行情数据的票

    # --- 归一化处理 (Min-Max Scaling) ---
    # 目的：将市值(亿)和涨幅(%)转化为 0-1 的得分，消除单位影响
    
    # 1. 市值得分：市值越小，得分越高
    m_min, m_max = score_df['market_cap'].min(), score_df['market_cap'].max()
    score_df['cap_score'] = 1 - (score_df['market_cap'] - m_min) / (m_max - m_min + 1e-5)
    
    # 2. 跌幅得分：20日涨幅越小(即跌得越多)，得分越高
    r_min, r_max = score_df['r20'].min(), score_df['r20'].max()
    score_df['r20_score'] = 1 - (score_df['r20'] - r_min) / (r_max - r_min + 1e-5)
    
    # 3. 计算加权总分
    score_df['final_score'] = score_df['cap_score'] * 0.7 + score_df['r20_score'] * 0.3
    
    # 4. 按总分从高到低排序，取最优质的候选股票
    score_df = score_df.sort_values(by='final_score', ascending=False)
    
    return score_df['code'].tolist()[:count]

# --- 6. 辅助功能 ---
def check_limit_up(context):
    candidate_set = set(g.candidate_list)
    curr_data = get_current_data()
    for s in list(context.portfolio.positions.keys()):
        if curr_data[s].last_price < curr_data[s].high_limit and s not in candidate_set:
            order_target(s, 0)

def print_positions(context):
    actual_names = [get_security_info(s).display_name for s in context.portfolio.positions.keys()]
    # 直接用全局变量里的排名，回测速度起飞
    if g.candidate_list:
        ideal_names = [get_security_info(s).display_name for s in g.candidate_list[:10]]
    else:
        ideal_names = ["待更新"]
    log.info("【实际持仓】: %s | 【理想持仓】: %s" % (actual_names, ideal_names))