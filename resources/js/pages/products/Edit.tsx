// Import reusable UI components from the local component library
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Import the main layout for authenticated application pages
import AppLayout from '@/layouts/app-layout';

// Import Inertia.js utilities for page head management, navigation, and form handling
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

// Direct Inertia client API access for custom POST/PUT requests - to import install (npm install @inertiajs/inertia)
import { Inertia } from '@inertiajs/inertia';

// TypeScript interface for the Product object
interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
}

// Props interface to define what data this component expects
interface Props {
    product: Product;
}

// The Edit component allows users to edit an existing product
function Edit({ product }: Props) {
    // Initialize form state using Inertia's useForm hook
    const { data, setData, put, processing, errors } = useForm({
        name: product.name ?? '',                // Default to product's current name
        price: product.price ?? 0,               // Default to product's current price
        description: product.description ?? '',  // Default to current description
        image: product.image ?? null,            // Existing image filename
        newImage: null as File | null,           // New image file (if uploaded)
    });

    // Handles form submission
    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent page refresh on form submit

        const formData = new FormData(); // Create a FormData object for file upload

        // Append form fields to FormData
        formData.append('name', data.name);
        formData.append('price', String(data.price));
        formData.append('description', data.description);

        // Append new image if it exists
        if (data.newImage) {
            formData.append('newImage', data.newImage);
        }

        // Laravel requires '_method' to spoof PUT requests
        formData.append('_method', 'PUT');

        // Send the form data to the backend using Inertia
        Inertia.post(route('product.update', product.id), formData, {
            forceFormData: true, // Ensures proper format for file upload
        });
    };

    // Component JSX return
    return (
        <AppLayout breadcrumbs={[{ title: 'Edit a product', href: `/products/${product.id}/edit` }]}>
            <Head title="Update a Product" /> {/* Sets the page title */}

            {/* Link to navigate back to the product list */}
            <Link href={route('product.index')} className="p-4 text-blue-500 underline">
                Back
            </Link>

            <div className="w-8/12 p-4">
                {/* Product update form */}
                <form onSubmit={handleUpdate} className="space-y-4">
                    {/* Display validation errors if any */}
                    {Object.keys(errors).length > 0 && (
                        <Alert>
                            <AlertTitle>Heads up</AlertTitle>
                            <AlertDescription>
                                <ul>
                                    {Object.entries(errors).map(([key, message]) => (
                                        <li key={key}>{message as string}</li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Display current product image */}
                    <div>
                        <img src={`/product_img/${data.image}`} alt={data.name} width={50} />
                    </div>

                    {/* Input field for product name */}
                    <div>
                        <Label>Name</Label>
                        <Input
                            placeholder="Product name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                    </div>

                    {/* Input field for product price */}
                    <div>
                        <Label>Price</Label>
                        <Input
                            placeholder="Product price"
                            value={data.price}
                            onChange={(e) => setData('price', Number(e.target.value))}
                        />
                    </div>

                    {/* Textarea for product description */}
                    <div>
                        <Label>Description</Label>
                        <Textarea
                            placeholder="Product description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                    </div>

                    {/* Input for uploading a new product image */}
                    <div>
                        <Label>New Image (optional)</Label>
                        <Input
                            name="newImage"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('newImage', e.target.files?.[0] ?? null)}
                        />
                    </div>

                    {/* Submit button */}
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Updating...' : 'Update Product'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}

export default Edit; // Export the Edit component as default
