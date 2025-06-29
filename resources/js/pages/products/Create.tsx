// Import UI components from your design system
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Import layout wrapper and type for breadcrumbs
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

// Inertia imports for page management and form handling
import { Head, Link, useForm } from '@inertiajs/react';

import React from 'react';

// Breadcrumb navigation item for this page
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Add new product',
        href: '/products/create',
    },
];

function Create() {
    // useForm hook from Inertia to manage form state
    const { data, setData, post, processing, errors } = useForm({
        name: '',             // Product name
        price: '',            // Product price
        description: '',      // Product description
        image: null as File | null, // Product image file
    });

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default browser form behavior

        // Submit the form to Laravel route `product.store`
        post(route('product.store'), {
            forceFormData: true, // Ensures file uploads are handled correctly
        });
    };

    return (
        // Wrap the page in the application layout and provide breadcrumbs
        <AppLayout breadcrumbs={breadcrumbs}>
            {/* Set page <title> tag */}
            <Head title="Products" />

            {/* Link to go back to product index/listing */}
            <Link href={route('product.index')} className="p-4 text-blue-500 underline">
                Back
            </Link>

            {/* Form container */}
            <div className="w-8/12 p-4">
                {/* Form for creating a new product */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Display any validation errors from backend */}
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

                    {/* Input: Product Name */}
                    <div>
                        <Label>Name</Label>
                        <Input
                            placeholder="Product name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                    </div>

                    {/* Input: Product Price */}
                    <div>
                        <Label>Price</Label>
                        <Input
                            placeholder="Product price"
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                        />
                    </div>

                    {/* Textarea: Product Description */}
                    <div>
                        <Label>Description</Label>
                        <Textarea
                            placeholder="Product description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                    </div>

                    {/* Input: Product Image (file input) */}
                    <div>
                        <Label>Image</Label>
                        <Input
                            type="file"
                            onChange={(e) => setData('image', e.target.files?.[0] ?? null)}
                        />
                    </div>

                    {/* Submit button */}
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Saving...' : 'Save Product'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}

export default Create;
