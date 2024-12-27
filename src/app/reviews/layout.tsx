function reviewsRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-col justify-between gap-5 px-4 py-[59px] tablet:w-[744px] tablet:justify-start tablet:px-1.5 desktop:w-[1200px] desktop:px-0">
      {children}
    </main>
  );
}
export default reviewsRootLayout;
