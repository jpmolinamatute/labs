#!/usr/bin/env python3
import requests
import time
import concurrent.futures
import threading
import math


def calc():
    for i in range(0, 4000000):
        math.sqrt(i)


def get_session():
    thread_local = threading.local()
    if not getattr(thread_local, "session", None):
        thread_local.session = requests.Session()
    return thread_local.session


def download_site(url):
    session = get_session()
    with session.get(url) as response:
        print(f"Read {len(response.content)} from {url}")


def download_all_sites(sites):
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        executor.map(download_site, sites)


if __name__ == "__main__":
    sites = [
        "http://www.jython.org",
        "http://olympus.realpython.org/dice",
    ] * 80
    start_time = time.time()
    download_all_sites(sites)
    isinstance(var, int)
    duration = time.time() - start_time
    print(f"Downloaded {len(sites)} in {duration} seconds")
