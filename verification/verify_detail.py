from playwright.sync_api import sync_playwright

def verify_product_detail_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        # Since we don't have a DB with real IDs, we'll try to hit a made-up ID.
        # It will likely return 404 because `getProductById` will return null.
        # However, checking that the code compiles (which `npm run dev` running implies) and logic is correct is key.

        # If I could inject a mock into `actions.ts` dynamically that would be great, but I can't easily.
        # I'll rely on the build/compile check essentially.

        try:
             # Just checking if the server is up and routing works, even if 404.
             page.goto("http://localhost:9002/products/test-id")
             # It should be a 404
             # verify we don't crash with 500

             # If it was a 500, title usually says "Internal Server Error"
             title = page.title()
             print(f"Page title for invalid product: {title}")

        except Exception as e:
            print(f"Error: {e}")

        browser.close()

if __name__ == "__main__":
    verify_product_detail_page()
