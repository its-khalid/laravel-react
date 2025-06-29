// Inertia and React imports
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { PageProps } from '@inertiajs/core';

// UI components
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';

// Layout and icons
import AppLayout from '@/layouts/app-layout';
import { MessageSquareDot, Search } from 'lucide-react';

// Type for breadcrumb
import { type BreadcrumbItem } from '@/types';

// Define breadcrumb navigation items
const breadcrumbs: BreadcrumbItem[] = [{ title: 'Products', href: '/products' }];

// Define Product shape
interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
}

// Props received from Inertia backend
interface PageProp extends PageProps {
    flash: { message?: string };    // Flash message (e.g., "Product deleted")
    products: Product[];            // List of products
}

function Index() {
    // Destructure props passed from backend
    const { products, flash } = usePage<PageProp>().props;

    // useForm hook for making delete requests and tracking form state
    const { processing, delete: destroy } = useForm();

    // Handle product deletion with confirmation
    const handleDelete = (id: number, name: string) => {
    if (confirm(`Confirm ${name} id - ${id} deletion`)) {
        destroy(route('product.delete', id)); // Calls Laravel route to delete product
    }
    };

    return (
    <AppLayout breadcrumbs={breadcrumbs}>
        {/* Sets the page title in the browser tab */}
        <Head title="Products" />

        {/* Button to add a new product */}
        <div className="m-4">
        <Link href={route('product.create')}>
            <Button>Add new product</Button>
        </Link>
        </div>

        {/* Search form (GET method triggers a filtered request) */}
        <form method="get" className="flex p-4">
        <Input placeholder="Search name or description" name="search_product" />
        <Button type="submit" className="bg-blue-700 hover:bg-blue-800">
            <Search />
        </Button>
        </form>

        {/* Show flash message if it exists */}
        {flash.message && (
        <Alert>
            <MessageSquareDot />
            <AlertTitle>Notification</AlertTitle>
            <AlertDescription>{flash.message}</AlertDescription>
        </Alert>
        )}

        {/* Conditionally render product table or fallback message */}
        {products.length > 0 ? (
        <div className="m-4">
            <Table>
            <TableCaption>A list of your recent products.</TableCaption>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {/* Loop through products and render each row */}
                {products.map(({ id, name, price, description, image }) => (
                <TableRow key={id}>
                    <TableCell className="font-medium">{id}</TableCell>
                    <TableCell>
                    <img src={`/product_img/${image}`} alt={name} width={50} />
                    </TableCell>
                    <TableCell>{name}</TableCell>
                    <TableCell>{price}</TableCell>
                    <TableCell>{description}</TableCell>
                    <TableCell className="text-right space-x-2">
                    {/* Edit button */}
                    <Link href={route('product.edit', id)}>
                        <Button className="bg-blue-700 hover:bg-blue-800">Edit</Button>
                    </Link>

                    {/* Delete button (triggers handleDelete) */}
                    <Button
                        disabled={processing}
                        onClick={() => handleDelete(id, name)}
                        className="bg-red-700 hover:bg-red-800"
                    >
                        Delete
                    </Button>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>
        ) : (
        // Message shown when no products are available
        <p className="text-gray-400 text-center mt-4">No products found</p>
        )}
    </AppLayout>
    );
}

export default Index