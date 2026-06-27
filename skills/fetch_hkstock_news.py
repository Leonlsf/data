#!/usr/bin/env python3
import requests
from bs4 import BeautifulSoup
import json
import re
from datetime import datetime, timedelta
import time
import hashlib
import argparse
import sys

def fix_page_url(url):
    if '/go/CompanyNews/page/' in url:
        match = re.search(r'/page/(\d+)/code/(\w+)\.html', url)
        if match:
            page = match.group(1)
            code = match.group(2)
            return f'https://stock.finance.sina.com.cn/hkstock/go.php/CompanyNews/page/{page}/code/{code}/.phtml'
    return url

def fetch_html(url, retries=3):
    headers = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36','Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8','Accept-Language':'zh-CN,zh;q=0.9,en;q=0.8'}
    for attempt in range(retries):
        try:
            response = requests.get(url, headers=headers, timeout=15, allow_redirects=True)
            if response.status_code == 456:
                time.sleep(5*(attempt+1))
                continue
            response.raise_for_status()
            return response.content.decode('gbk', errors='ignore')
        except Exception as e:
            if attempt < retries-1:
                time.sleep(5*(attempt+1))
            else:
                print(f'获取页面失败: {e}')
                return None
    return None

def parse_page(html):
    if not html:
        return [], None
    soup = BeautifulSoup(html, 'html.parser')
    news_list = []
    news_container = soup.find('ul', class_='list01')
    if not news_container:
        return [], None
    items = news_container.find_all('li')
    for item in items:
        link = item.find('a')
        if not link:
            continue
        title = link.get_text(strip=True)
        href = link.get('href', '')
        if not title or len(title) < 5:
            continue
        date_str = None
        time_str = None
        spans = item.find_all('span')
        for span in spans:
            text = span.get_text(strip=True)
            date_match = re.search(r'(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})', text)
            if date_match:
                date_str = date_match.group(1)
                time_str = date_match.group(2)
                break
        if date_str and time_str:
            if href.startswith('//'):
                href = 'https:' + href
            elif href.startswith('/'):
                href = 'https://stock.finance.sina.com.cn' + href
            elif not href.startswith('http'):
                continue
            news_list.append({'title': title, 'url': href, 'date': date_str, 'time': time_str, 'publishedAt': f'{date_str}T{time_str}+08:00'})
    next_page_url = None
    all_links = soup.find_all('a')
    for link in all_links:
        text = link.get_text(strip=True)
        if '下一页' in text:
            href = link.get('href', '')
            if href and 'page' in href:
                next_page_url = fix_page_url(href)
                break
    return news_list, next_page_url

def is_date_in_range(date_str, start_date, end_date):
    try:
        date = datetime.strptime(date_str, '%Y-%m-%d')
        return start_date <= date <= end_date
    except:
        return False

def generate_id(title, index, stock_code):
    hash_val = hashlib.md5(f"{title}-{stock_code}-{index}".encode()).hexdigest()
    return f'hk{stock_code}-{hash_val[:12]}-{index}'

def fetch_stock_news(stock_code, days=30, end_date=None, output_file=None, max_pages=50):
    if end_date is None:
        end_date = datetime.today()
    start_date = end_date - timedelta(days=days)
    if output_file is None:
        output_file = f'hk{stock_code}_news_data.json'
    print(f'新浪港股新闻采集器 - 股票代码: {stock_code}')
    print(f'采集范围：{start_date.strftime("%Y-%m-%d")} 至 {end_date.strftime("%Y-%m-%d")}（最近{days}天）')
    base_url = f'https://stock.finance.sina.com.cn/hkstock/news/{stock_code}.html'
    all_news = []
    current_url = base_url
    page = 1
    has_next_page = True
    while has_next_page and page <= max_pages:
        print(f'正在采集第 {page} 页...')
        html = fetch_html(current_url)
        if not html:
            break
        news, next_page_url = parse_page(html)
        print(f'获取到 {len(news)} 条新闻')
        if news:
            dates = [item['date'] for item in news]
            print(f'日期范围：{min(dates)} ~ {max(dates)}')
        valid_news = [item for item in news if is_date_in_range(item['date'], start_date, end_date)]
        if valid_news:
            all_news.extend(valid_news)
        if news:
            last_date = news[-1]['date']
            if not is_date_in_range(last_date, start_date, end_date):
                print(f'最后一篇新闻日期 {last_date} 已超出范围，停止采集')
                has_next_page = False
            elif next_page_url:
                current_url = next_page_url
                page += 1
                time.sleep(3)
            else:
                has_next_page = False
        else:
            has_next_page = False
    seen_urls = set()
    unique_news = []
    for item in all_news:
        if item['url'] not in seen_urls:
            seen_urls.add(item['url'])
            unique_news.append(item)
    unique_news.sort(key=lambda x: x['publishedAt'], reverse=True)
    final_news = []
    for index, item in enumerate(unique_news, 1):
        final_news.append({'id': generate_id(item['title'], index, stock_code), 'title': item['title'], 'summary': item['title'][:50] + ('...' if len(item['title']) > 50 else ''), 'source': '新浪财经', 'url': item['url'], 'publishedAt': item['publishedAt']})
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(final_news, f, ensure_ascii=False, indent=2)
    print(f'采集完成！共获取 {len(final_news)} 条新闻')
    return final_news

def main():
    parser = argparse.ArgumentParser(description='新浪港股通用新闻采集器')
    parser.add_argument('--stock', '-s', type=str, required=True, help='港股代码')
    parser.add_argument('--days', '-d', type=int, default=30, help='采集最近N天的新闻')
    parser.add_argument('--output', '-o', type=str, default=None, help='输出JSON文件名')
    parser.add_argument('--max-pages', '-m', type=int, default=50, help='最多采集多少页')
    parser.add_argument('--end-date', '-e', type=str, default=None, help='结束日期')
    args = parser.parse_args()
    end_date = None
    if args.end_date:
        end_date = datetime.strptime(args.end_date, '%Y-%m-%d')
    else:
        end_date = datetime.today()
    fetch_stock_news(stock_code=args.stock, days=args.days, end_date=end_date, output_file=args.output, max_pages=args.max_pages)

if __name__ == '__main__':
    main()
