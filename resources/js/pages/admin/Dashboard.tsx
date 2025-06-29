// Importing layout and utility types
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

// Importing Inertia.js utilities for SPA behavior
import { Head } from '@inertiajs/react';

// Define the breadcrumb trail to show navigation hierarchy
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
];

function Dashboard() {
    
    return (
        // Wrapping content in AppLayout with breadcrumb navigation
        <AppLayout breadcrumbs={breadcrumbs}>
            {/* Set the browser tab title */}
            <Head title="Dashboard" />

        </AppLayout>
    );
}

export default Dashboard;
