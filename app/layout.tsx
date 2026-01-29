import "./globals.css";

export const metadata = {
  title: "Aurelia Jewels",
  description: "Premium Jewelry Store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }}>
      <body className="bg-white text-black antialiased">
        {/* We are removing the Header temporarily to see if it was the cause */}
        <div className="flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
