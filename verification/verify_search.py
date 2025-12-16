from playwright.sync_api import sync_playwright

def verify_search_design():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        try:
            page.goto("http://localhost:9002")

            # Scroll to product section
            page.evaluate("document.getElementById('produk').scrollIntoView()")
            page.wait_for_timeout(1000)

            # Check for Search Input
            search_input = page.get_by_placeholder("Banner")
            if not search_input.is_visible():
                print("Search input not visible")

            # Check for Search Button (Cari)
            search_button = page.get_by_role("button", name="Cari")
            if not search_button.is_visible():
                print("Search button not visible")

            # Take screenshot
            page.screenshot(path="verification/search_design.png")
            print("Screenshot saved to verification/search_design.png")

        except Exception as e:
            print(f"Error: {e}")

        browser.close()

if __name__ == "__main__":
    verify_search_design()
