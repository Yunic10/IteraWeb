export default function ApplicationLogo({ className = 'h-20 w-20', ...props }) {
    return (
        <img
            src="/images/logo-company.png"
            alt="Itera Studio"
            className={`${className} object-contain`} 
            {...props}
        />
    );
}
