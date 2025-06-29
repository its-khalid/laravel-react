<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class ProductController extends Controller
{
    // Display list of products
    public function index(Request $request) {
        // Get products owned by the currently authenticated user
        $query = Product::where('user_id', Auth::id());

        // If there's a search query, filter by name or description
        if ($request->filled('search_product')) {
            $query->where('name', 'like', "%{$request->input('search_product')}%")
                ->orWhere('description', 'like', "%{$request->input('search_product')}%");
        }

        $products = $query->get();

        // Render the 'products/Index' Inertia page, passing the products
        return Inertia::render('products/Index', compact('products'));
    }

    // Show the form to create a new product
    public function create() {
        return Inertia::render('products/Create');
    }

    // Store a new product
    public function store(Request $request) {
        // Validate request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:png,jpg,jpeg|max:2048',
        ]);

        // If an image is uploaded, store it in public/product_img
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imgName = time() . '_' . $image->getClientOriginalName(); // Unique filename
            $image->move(public_path('product_img'), $imgName);        // Save to disk
            $validatedData['image'] = $imgName;                        // Save filename to DB
        }

        // Add the user_id to associate the product with the current user
        $validatedData['user_id'] = Auth::id();

        // Save the new product
        Product::create($validatedData);

        // Redirect back to index with a success message
        return redirect()->route('product.index')->with('message', 'Product stored successfully');
    }

    // Show the form to edit a specific product
    public function edit($id) {
        $product = Product::findOrFail($id); // Find or fail if not found
        return Inertia::render('products/Edit', compact('product')); // Pass product to frontend
    }

    // Update a specific product
    public function update(Request $request, $id) {
        $product = Product::findOrFail($id);

        // Validate the request
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'description' => 'nullable|string',
            'newImage' => 'nullable|image|mimes:png,jpg,jpeg|max:2048',
        ]);

        // If a new image is uploaded
        if ($request->hasFile('newImage')) {
            // Delete the old image if it exists
            if ($product->image && File::exists(public_path('product_img/' . $product->image))) {
                File::delete(public_path('product_img/' . $product->image));
            }

            // Save the new image
            $image = $request->file('newImage');
            $imgName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('product_img'), $imgName);
            $validatedData['image'] = $imgName;

            // Remove 'newImage' from the array so it doesn't go into the DB
            unset($validatedData['newImage']);
        }

        // Update the product with validated data
        $product->update($validatedData);

        // Redirect to index with success message
        return redirect()->route('product.index')->with('message', 'Product updated successfully.');
    }

    // Delete a product
    public function delete($id) {
        $product = Product::findOrFail($id);

        // Delete the product image from the disk if it exists
        if ($product->image && File::exists(public_path('product_img/' . $product->image))) {
            File::delete(public_path('product_img/' . $product->image));
        }

        // Delete the product from the database
        $product->delete();

        // Redirect back to index with success message
        return redirect()->route('product.index')->with('message', 'Product deleted successfully.');
    }
}
