const verifyRecaptcha = async (token: string, secret: string) => {
  const response = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secret}&response=${token}`,
    }
  );
  const json = (await response.json()) as { success: boolean };
  if (!json.success) {
    throw new Error("invalid recaptcha token");
  }
}

export default verifyRecaptcha;