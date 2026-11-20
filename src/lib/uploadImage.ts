
export async function uploadImageToImgBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!apiKey) {
    console.warn("NEXT_PUBLIC_IMGBB_API_KEY is not defined in .env. Using fallback object URL.");
    return URL.createObjectURL(file);
  }

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (data?.success && data?.data?.url) {
    return data.data.url;
  }

  throw new Error(data?.error?.message || "ImgBB image upload failed");
}
