import * as LucideIcons from 'lucide-react';

const Icon = ({ name, size = 24, className, ...props }) => {
    const LucideIcon = LucideIcons[name];

    if (!LucideIcon) {
        console.warn(`Icon "${name}" not found`);
        return null;
    }

    return <LucideIcon size={size} className={className} {...props} />;
};

export default Icon;
