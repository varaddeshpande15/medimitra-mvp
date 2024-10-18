from bs4 import BeautifulSoup

# Read the downloaded HTML file
with open('moneycontrol.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# Parse the HTML content with BeautifulSoup
soup = BeautifulSoup(html_content, 'html.parser')

# Assuming headlines are within <h2> tags with a specific class (you need to inspect the webpage to confirm this)
# For example, let's assume headlines are inside <h2> tags with a class 'headline'
headlines = soup.find_all('h2', class_='headline')  # Update with the correct tag and class

# Print out each headline
for i, headline in enumerate(headlines):
    print(f"Headline {i+1}: {headline.get_text(strip=True)}")