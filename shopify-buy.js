// Shopify Buy Buttons for gallery photos.
// Add <div class="shopify-buy" data-shopify-product-id="..."></div> under a photo;
// this file loads the Buy Button SDK once and mounts a button in every such div.
(function () {
    const shopDomain = "yck0vb-xi.myshopify.com";
    // Public Storefront API token, meant to be embedded in pages.
    const storefrontAccessToken = "914c4a6842d6a551389be5114887a91c";
    const scriptURL = "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";

    const nodes = Array.from(document.querySelectorAll(".shopify-buy[data-shopify-product-id]"));
    if (!nodes.length) {
        return;
    }

    function init() {
        const client = ShopifyBuy.buildClient({ domain: shopDomain, storefrontAccessToken: storefrontAccessToken });
        ShopifyBuy.UI.onReady(client).then((ui) => {
            nodes.forEach((node) => {
                ui.createComponent("product", {
                    id: node.getAttribute("data-shopify-product-id"),
                    node: node,
                    moneyFormat: "${{amount}}",
                    options: {
                        product: {
                            // The photo is already shown above, so skip the product image
                            // and let the button fill the gallery column.
                            contents: { img: false },
                            styles: { product: { "max-width": "100%", "margin-left": "0", "margin-bottom": "0" } }
                        },
                        modalProduct: {
                            contents: { img: false, imgWithCarousel: true },
                            styles: { product: { "@media (min-width: 601px)": { "max-width": "100%", "margin-left": "0px", "margin-bottom": "0px" } } }
                        }
                    }
                });
            });
        });
    }

    if (window.ShopifyBuy && window.ShopifyBuy.UI) {
        init();
    } else {
        const script = document.createElement("script");
        script.async = true;
        script.src = scriptURL;
        script.onload = init;
        document.head.appendChild(script);
    }
})();
