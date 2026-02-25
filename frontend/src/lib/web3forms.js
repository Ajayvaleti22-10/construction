/**
 * Web3Forms submission for static site. No backend required.
 * Set REACT_APP_WEB3FORMS_ACCESS_KEY in .env to enable.
 */

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

export function getWeb3FormsAccessKey() {
  return process.env.REACT_APP_WEB3FORMS_ACCESS_KEY || "";
}

export function isWeb3FormsConfigured() {
  const key = getWeb3FormsAccessKey();
  return Boolean(key && key !== "YOUR_ACCESS_KEY_HERE" && key.trim().length > 0);
}

/**
 * Submit to Web3Forms. Payload must include access_key and can include
 * subject, from_name, message, and any custom fields.
 * @returns {{ success: boolean, message?: string }}
 */
export async function submitWeb3Form(payload) {
  const accessKey = getWeb3FormsAccessKey();
  if (!accessKey || accessKey === "YOUR_ACCESS_KEY_HERE") {
    return { success: false, message: "Form is not configured. Add REACT_APP_WEB3FORMS_ACCESS_KEY." };
  }
  try {
    const body = {
      access_key: accessKey,
      ...payload,
    };
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || "Submission failed." };
    if (data.success) return { success: true, message: data.message };
    return { success: false, message: data.message || "Submission failed." };
  } catch (e) {
    console.error("Web3Forms submit error:", e);
    return { success: false, message: "Network error. Please try again." };
  }
}
