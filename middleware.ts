import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req: NextRequest) => {
    // console.log(req)
    const { nextUrl, auth } = req;

    // Daftarkan rute publik dan rute otentikasi
    const publicUrls = ["/site", "/app", "/cockpit"]; // Rute publik
    const authUrls = ["/login", "/register"]; // Rute untuk otentikasi

    const isLoggedIn = !!auth?.user; // Periksa apakah pengguna telah login
    const currentUrl = nextUrl.pathname; // URL saat ini yang sedang diakses

    // Dapatkan hostname dan sesuaikan jika perlu
    const hostname =
        req.headers
            .get("host")
            ?.replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) ??
        "";

    console.log("URL : ", hostname)
    const customSubDomain = req.headers
        .get("host")
        ?.split(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)[0]; // Mendapatkan bagian sebelum domain utama
    // console.log("Subdomain ", customSubDomain)
    // Daftar subdomain yang diizinkan tanpa pengecekan auth
    const allowedSubdomains = ["test1", "test2"];
    // console.log(currentUrl);
    if (publicUrls.includes(currentUrl)) {
        return NextResponse.next();
    }

    if (authUrls.includes(currentUrl)) {
        return NextResponse.next();
    }

    console.log("Check root", process.env.NEXT_PUBLIC_ROOT_DOMAIN)
    console.log("Check domain", customSubDomain)
    console.log("Check Login", isLoggedIn)
    // console.log("IF", allowedSubdomains.includes("test1"));

    if (
        hostname === "localhost:3000" ||
        hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN
    ) {
        // Pengalihan ke /site untuk domain utama
        return NextResponse.rewrite(
            new URL(
                `/site${nextUrl.pathname === "/" ? "" : nextUrl.pathname}`,
                req.url
            )
        );
    }

    if (customSubDomain) {
        // console.log("on id CustomeSubDomain")
        if (customSubDomain === "app") {
            // Pengalihan ke /app dengan pengecekan login
            if (!isLoggedIn && nextUrl.pathname !== "/login") {
                console.log("NOT LOGIN");
                return NextResponse.redirect(new URL("/login", req.url));
            } else if (isLoggedIn && nextUrl.pathname === "/login") {
                console.log("LOGIN");
                return NextResponse.redirect(new URL("/app", req.url));
            }
            return NextResponse.rewrite(
                new URL(
                    `/app${nextUrl.pathname === "/" ? "" : nextUrl.pathname}`,
                    req.url
                )
            );
            console.log("App")
        } else if (customSubDomain === "cockpit") {
            // Pengalihan ke /cockpit tanpa pengecekan login
            console.log("Cockpit")
            // if (!isLoggedIn && nextUrl.pathname !== "/login") {
            //     console.log("NOT LOGIN");
            //     return NextResponse.redirect(new URL("/login", req.url));
            // } else if (isLoggedIn && nextUrl.pathname === "/login") {
            //     console.log("LOGIN");
            //     return NextResponse.redirect(new URL("/cockpit", req.url));
            // }
            // return NextResponse.rewrite(
            //     new URL(
            //         `/cockpit${nextUrl.pathname === "/" ? "" : nextUrl.pathname}`,
            //         req.url
            //     )
            // );
        } else if (allowedSubdomains.includes(customSubDomain)) {
            // Pengalihan ke rute dinamis /[domain]/[slug] untuk subdomain yang ada di array allowedSubdomains
            // console.log("domain", customSubDomain);
            return NextResponse.rewrite(
                new URL(`/${customSubDomain}${nextUrl.pathname}`, req.url)
            );
        } else {
            // Jika customSubDomain tidak ada dalam daftar yang diizinkan, return 404
            // console.log("Subdomain tidak dikenal, return 404");
            // return NextResponse.rewrite(new URL("/not-found", req.url));
            return NextResponse.rewrite(
                new URL(
                    `/not-found${nextUrl.pathname === "/" ? "" : nextUrl.pathname}`,
                    req.url
                )
            );
        }
    }

    // Jika tidak memenuhi kondisi mana pun, return 404
    console.log("Hostname atau subdomain tidak dikenali, return 404");
    return NextResponse.rewrite(new URL("/not-found", req.url));
});

export const config = {
    matcher: ["/((?!api/|_next/|_vercel|images/|static/|[\\w-]+\\.\\w+$).*)"],
};
