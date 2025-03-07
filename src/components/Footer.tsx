import { ReactNode } from "react";

interface FooterProps {
   children: ReactNode;
}
function Footer({ children }: FooterProps) {
   return <footer>{children}</footer>;
}

export default Footer;
