/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        deliver_service_url: "localhost:8080/api/",
        submission_service_url: "localhost:8081/api/",
        moderator_service_url: "localhost:8082/api/"
    },
};

export default nextConfig;
