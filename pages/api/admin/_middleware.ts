import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
// import { jwt } from '../../utils';

export async function middleware(req: NextRequest | any, ev: NextFetchEvent) {
	const session: any = await getToken({
		req,
		secret: "wdPesjEG3rsRZIKJt20iS5TmpL89hpVcV3oVXuizbVU=",
	});

	if (!session) {
		return new Response(JSON.stringify({ message: "No autorizado" }), {
			status: 401,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	const validRoles = ["admin", "super-user", "SEO"];
	if (!validRoles.includes(session.user.role)) {
		return new Response(JSON.stringify({ message: "No autorizado" }), {
			status: 401,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	return NextResponse.next();
}
