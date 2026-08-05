(() => {
  const getCapacitorPlugin = name => window.Capacitor?.Plugins?.[name] ?? null;
  const isNative = () => Boolean(window.Capacitor?.isNativePlatform?.() || window.Capacitor?.getPlatform?.() === "ios" || window.Capacitor?.getPlatform?.() === "android");
  const platform = () => window.Capacitor?.getPlatform?.() || (/Android/i.test(navigator.userAgent) ? "android" : /iPhone|iPad|iPod/i.test(navigator.userAgent) ? "ios-web" : "web");

  async function haptic(kind = "error") {
    const plugin = getCapacitorPlugin("Haptics");
    try {
      if (plugin) {
        if (kind === "success" && plugin.notification) return await plugin.notification({ type: "SUCCESS" });
        if (kind === "error" && plugin.notification) return await plugin.notification({ type: "ERROR" });
        if (plugin.impact) return await plugin.impact({ style: kind === "error" ? "HEAVY" : "MEDIUM" });
      }
      if (navigator.vibrate) navigator.vibrate(kind === "error" ? [70, 40, 100] : 45);
    } catch (error) {
      console.warn("Haptic non disponibile", error);
    }
  }

  async function scheduleDailyReminder(time = "19:00") {
    const [hour, minute] = time.split(":").map(Number);
    const plugin = getCapacitorPlugin("LocalNotifications");
    if (plugin) {
      const permission = await plugin.requestPermissions();
      if (permission.display !== "granted") return { ok: false, message: "Permesso notifiche non concesso." };
      await plugin.cancel({ notifications: [{ id: 7101 }] }).catch(() => {});
      await plugin.schedule({
        notifications: [{
          id: 7101,
          title: "CodeForge Academy",
          body: "È il momento del ripasso giornaliero. Mantieni viva la tua serie!",
          schedule: { on: { hour, minute }, repeats: true, allowWhileIdle: true },
          smallIcon: "ic_stat_codeforge",
          actionTypeId: "",
          extra: { route: "daily" }
        }]
      });
      return { ok: true, native: true, message: `Promemoria giornaliero impostato alle ${time}.` };
    }

    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return { ok: false, message: "Permesso notifiche non concesso." };
      localStorage.setItem("codeforge_web_reminder", time);
      return { ok: true, native: false, message: "Promemoria salvato. Nella versione web verrà ricordato all'apertura dell'app." };
    }
    return { ok: false, message: "Le notifiche non sono supportate da questo browser." };
  }

  async function cancelDailyReminder() {
    const plugin = getCapacitorPlugin("LocalNotifications");
    if (plugin) await plugin.cancel({ notifications: [{ id: 7101 }] }).catch(() => {});
    localStorage.removeItem("codeforge_web_reminder");
    return { ok: true };
  }

  async function saveNativePreferences(key, value) {
    const plugin = getCapacitorPlugin("Preferences");
    if (plugin) {
      await plugin.set({ key, value: JSON.stringify(value) });
      return true;
    }
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  }

  async function readNativePreferences(key) {
    const plugin = getCapacitorPlugin("Preferences");
    if (plugin) {
      const result = await plugin.get({ key });
      return result.value ? JSON.parse(result.value) : null;
    }
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  async function updateStreakWidget(data) {
    await saveNativePreferences("codeforge_widget_state", data);
    const widgetPlugin = getCapacitorPlugin("CodeForgeWidget") || window.CodeForgeWidget;
    if (widgetPlugin?.update) {
      try {
        await widgetPlugin.update(data);
        return { ok: true, native: true };
      } catch (error) {
        console.warn("Widget non aggiornato", error);
      }
    }
    return { ok: true, native: false };
  }

  async function restorePurchases() {
    const billing = getCapacitorPlugin("CodeForgeBilling") || window.CodeForgeBilling;
    if (billing?.restorePurchases) {
      try {
        const result = await billing.restorePurchases();
        return { ok: true, active: Boolean(result?.active), result };
      } catch (error) {
        return { ok: false, message: error?.message || "Ripristino non riuscito." };
      }
    }
    return { ok: false, setupRequired: true, message: "Collega i prodotti App Store e Google Play Billing nella build nativa." };
  }

  async function purchasePro() {
    const billing = getCapacitorPlugin("CodeForgeBilling") || window.CodeForgeBilling;
    if (billing?.purchase) {
      try {
        const result = await billing.purchase({ productId: "codeforge_pro_monthly" });
        return { ok: true, active: Boolean(result?.active), result };
      } catch (error) {
        return { ok: false, message: error?.message || "Acquisto non completato." };
      }
    }
    return { ok: false, setupRequired: true, message: "La versione gratuita è attiva. Gli acquisti saranno disponibili dopo la configurazione degli store." };
  }

  async function syncProgress(payload) {
    const baseUrl = window.CODEFORGE_API_BASE;
    if (!baseUrl) return { ok: false, setupRequired: true, message: "Backend cloud non ancora collegato: usa Esporta backup." };
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/v1/progress`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error(`Sync fallita (${response.status})`);
    return { ok: true, data: await response.json().catch(() => null) };
  }

  window.CodeForgeNative = {
    isNative,
    platform,
    haptic,
    scheduleDailyReminder,
    cancelDailyReminder,
    saveNativePreferences,
    readNativePreferences,
    updateStreakWidget,
    restorePurchases,
    purchasePro,
    syncProgress
  };
})();