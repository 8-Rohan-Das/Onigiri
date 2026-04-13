const API_URL = '/api/products';

export const getAllProducts = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching all products:", error);
        throw error; // Re-throw to handle it in the component
    }
};

export const getPopularProducts = async () => {
    try {
        const response = await fetch(`${API_URL}?popular=true`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching popular products:", error);
        throw error;
    }
};

export const getProductsByCategory = async (category) => {
    try {
        // Ensure category is URL-safe
        const encodedCategory = encodeURIComponent(category);
        const response = await fetch(`${API_URL}/category/${encodedCategory}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching products for category ${category}:`, error);
        throw error;
    }
};

export const addProduct = async (productData) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        });
        
        if (!response.ok) {
            // Try to extract backend error message if available
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.message || `HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error("Error adding product:", error);
        throw error;
    }
};
