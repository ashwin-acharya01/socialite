import { Outlet, Navigate } from "react-router-dom";

const PublicLayout = () => {
  const isAuthenticated = false;

  return (
    <>
    {isAuthenticated ? (
      <Navigate to="/"/>
    ) : (
      <div className="w-full h-dvh flex flex-row gap-0 justify-center items-center">
        <div className="hidden md:block w-1/2 h-full bg-[url('/assets/image/hero-img.jpg')] bg-cover bg-no-repeat bg-center"></div>
        <div className="w-full md:w-1/2 h-full overflow-auto">
          <section className="flex h-full w-full items-center justify-center">
            <Outlet />
          </section>
        </div>
      </div>
    )}
    </>
  )
}

export default PublicLayout