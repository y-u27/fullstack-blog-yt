import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

// インスタンス化
const prisma = new PrismaClient();

export async function main() {
  try {
    await prisma.$connect();
  } catch (err) {
    return Error("DB接続に失敗しました");
  }
}

// ブログの全記事取得API
export const GET = async (req: Request, res: NextResponse) => {
  try {
    await main();
    // findMany→データベースの全記事取得
    // ↓の場合のpostsは「schema.prisma」ファイルで作ったmodelのPostを小文字になったもの
    const posts = await prisma.post.findMany();
    return NextResponse.json({ message: "Success", posts }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 });
    // finally→エラーが出ても成功しても絶対に実行される文章
  } finally {
    // ↓接続を止める
    await prisma.$disconnect();
  }
};

// ブロブ投稿用API
export const POST = async (req: Request, res: NextResponse) => {
  try {
    const { title, description } = await req.json();

    await main();
    const post = await prisma.post.create({ data: { title, description } })
    return NextResponse.json({ message: "Success", post }, { status: 201});
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};