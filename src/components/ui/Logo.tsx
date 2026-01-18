import Image from "next/image";

interface LogoProps {
    className?: string;
}

export function Logo({ className }: LogoProps) {
    // Aspect ratio based on original SVG: 1029 / 382 ~= 2.69
    return (
        <div className={`relative ${className} aspect-[2.7]`}>
            <Image
                src="/logo.svg"
                alt="Little Image Photography"
                fill
                className="object-contain object-left"
                priority
            />
        </div>
    );
}
