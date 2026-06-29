#!/usr/bin/env python3
import json
import sys
import os
import time
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fetch_hkstock_news import fetch_stock_news
from fetch_astock_news import fetch_astock_news

SKILLS_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SKILLS_DIR)
OUTPUT_PATH = os.path.join(PROJECT_DIR, 'public', 'news-data.json')

def main():
    print('品牌资讯每日更新')
    print(f'执行时间: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')
    end_date = datetime.today()
    print('[1/4] 采集泡泡玛特(09992)港股资讯...')
    popmart_news = fetch_stock_news(stock_code='09992', days=30, end_date=end_date, output_file=os.path.join(SKILLS_DIR, 'hk09992_news.json'), max_pages=50)
    time.sleep(5)
    print('[2/4] 采集康师傅(00322)港股资讯...')
    masterkong_news = fetch_stock_news(stock_code='00322', days=30, end_date=end_date, output_file=os.path.join(SKILLS_DIR, 'hk00322_news.json'), max_pages=50)
    time.sleep(5)
    print('[3/4] 采集伊利(sh600887)A股资讯...')
    yili_news = fetch_astock_news(stock_code='sh600887', days=30, end_date=end_date, output_file=os.path.join(SKILLS_DIR, 'ash600887_news.json'), max_pages=50)
    time.sleep(5)
    print('[4/4] 采集三只松鼠(sz300783)A股资讯...')
    threesquirrels_news = fetch_astock_news(stock_code='sz300783', days=30, end_date=end_date, output_file=os.path.join(SKILLS_DIR, 'asz300783_news.json'), max_pages=50)
    news_data = {'lastUpdated': datetime.now().strftime('%Y-%m-%dT%H:%M:%S+08:00'), 'date': datetime.now().strftime('%Y-%m-%d'), 'brands': [{'brandName': '泡泡玛特', 'brandKey': 'popmart', 'brandColor': '#FFD700', 'news': popmart_news}, {'brandName': '康师傅', 'brandKey': 'masterkong', 'brandColor': '#E4002B', 'news': masterkong_news}, {'brandName': '伊利', 'brandKey': 'yili', 'brandColor': '#00A650', 'news': yili_news}, {'brandName': '三只松鼠', 'brandKey': 'threesquirrels', 'brandColor': '#FF6B00', 'news': threesquirrels_news}]}
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(news_data, f, ensure_ascii=False, indent=2)
    total = len(popmart_news) + len(masterkong_news) + len(yili_news) + len(threesquirrels_news)
    print(f'更新完成！泡泡玛特:{len(popmart_news)} 康师傅:{len(masterkong_news)} 伊利:{len(yili_news)} 三只松鼠:{len(threesquirrels_news)} 总计:{total}')

if __name__ == '__main__':
    main()
