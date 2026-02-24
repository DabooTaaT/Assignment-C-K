import i18n from "@/core/i18n";

describe("i18n configuration", () => {
  it("initializes with English as default", async () => {
    await i18n.changeLanguage("en");
    expect(i18n.language).toBe("en");
  });

  it("translates common.appName in English", async () => {
    await i18n.changeLanguage("en");
    expect(i18n.t("common:appName")).toBe("My App");
  });

  it("translates common.appName in Thai", async () => {
    await i18n.changeLanguage("th");
    expect(i18n.t("common:appName")).toBe("แอปของฉัน");
  });

  it("translates auth.loginTitle in English", async () => {
    await i18n.changeLanguage("en");
    expect(i18n.t("auth:loginTitle")).toBe("Sign In");
  });
});
