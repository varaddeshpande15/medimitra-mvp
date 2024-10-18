from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def scrape(scrape_url):
    chrome_options = Options()
    #chrome_options.add_argument("--headless")

    driver = webdriver.Chrome(options=chrome_options)

    url = scrape_url

    driver.get(url)

    # Wait for page to load
    wait = WebDriverWait(driver, 10)
    wait.until(EC.presence_of_element_located((By.TAG_NAME, 'body')))

    # Get all the elements on the page
    elements = driver.find_elements(By.TAG_NAME, '*')
    
    filename = scrape_url[scrape_url.rfind('/')+1:] + ".txt"

    # Save only the text content from the site body to a text file
    with open(filename, 'w', encoding="utf-8") as f:  # Open file in write mode
        body = driver.find_element(By.TAG_NAME, 'body')
        f.write(body.text)
    # # Save each element to a text file
    # with open('moneycontrol.html', 'w', encoding="utf-8") as f:  # Open file in write mode
    #     f.write(driver.page_source)

    driver.quit()

    return filename