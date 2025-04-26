/** @type {import('next').NextConfig} */
const nextConfig = {
    logging: {
        fetches: {
            hmrRefreshes: true,
        },
    },
    images: {
        domains: [ 'i.postimg.cc' ], // Adicione o domínio usado
    },
};

export default nextConfig;
