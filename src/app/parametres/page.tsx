ed ?? true,
        power_saver: r1.data?.power_saver ?? false,
      });
      setLoading(false);
    })();
    return () => { ok = false; };
  }, [router]);

  const saveAll = async (next: S, info?: string) => {
    if (!user) return;
    const tr = I18N[next.lang];
    setSaving(true);
    const now = new Date().toISOString();

    const basePayload = {
      user_id: user.id,
      display_name: next.display_name,
      avatar_url: next.avatar_url,
      language: LANG_LABELS[next.lang],
      notifications_enabled: next.notifications_enabled,
      power_saver: next.power_saver,
      updated_at: now,
    };

    let res1 = await supabase
      .from("user_settings")
      .upsert({ ...basePayload, dark_mode: next.dark_mode }, { onConflict: "user_id" });

    if (res1.error && res1.error.message.toLowerCase().includes("dark_mode")) {
      res1 = await supabase
        .from("user_settings")
        .upsert(basePayload, { onConflict: "user_id" });
    }

    const res2 = await supabase
      .from("user_player_preferences")
      .upsert({
        user_id: user.id,
        autoplay_videos: next.autoplay_videos,
        video_quality: next.video_quality,
        sound_enabled: next.sound_enabled,
        updated_at: now,
      }, { onConflict: "user_id" });

    setSaving(false);
    if (res1.error || res2.error) {
      setMsg(`${tr.errorPrefix} : ${res1.error?.message || res2.error?.message}`);
      return;
    }
    if (next.sound_enabled) playSuccess();
    setMsg(info ?? tr.saved);
  };

  const toggle = async (k: "dark_mode" | "autoplay_videos" | "notifications_enabled" | "sound_enabled" | "power_saver") => {
    if (s.sound_enabled) playClick();
    const next = { ...s, [k]: !s[k] };
    setS(next);
    await saveAll(next);
  };

  const cycleLang = async () => {
    if (s.sound_enabled) playClick();
    const nextLang = LANG_ORDER[(LANG_ORDER.indexOf(s.lang) + 1) % LANG_ORDER.length];
    const next = { ...s, lang: nextLang };
    setS(next);
    await saveAll(next, I18N[nextLang].langUpdated(LANG_LABELS[nextLang]));
  };

  const cycleQuality = async () => {
    if (s.sound_enabled) playClick();
    const list = [t.qualityHigh, t.qualityMed, t.qualityLow];
    const video_quality = list[(list.indexOf(s.video_quality) + 1) % list.length];
    const next = { ...s, video_quality };
    setS(next);
    await saveAll(next, t.qualityUpdated(video_quality));
  };

  const onAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (s.sound_enabled) playClick();
    setSaving(true);
    const ext = file.name.split(".").pop() || "png";
    const path = `${user.id}/avatar.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) { setSaving(false); setMsg(`${t.uploadPrefix} : ${error.message}`); return; }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const next = { ...s, avatar_url: `${data.publicUrl}?t=${Date.now()}` };
    setS(next);
    await saveAll(next, t.avatarUpdated);
  };

  const sendTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !subject.trim() || !body.trim()) return;
    if (s.sound_enabled) playClick();
    const { error } = await supabase.from("support_tickets").insert({
      user_id: user.id,
      subject: subject.trim(),
      message: body.trim(),
      status: "open",
    });
    if (error) { setMsg(`${t.errorPrefix} : ${error.message}`); return; }
    if (s.sound_enabled) playSuccess();
    setSubject(""); setBody(""); setSupportOpen(false);
    setMsg(t.ticketSent);
  };

  const signOut = async () => {
    if (s.sound_enabled) playClick();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  };

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-[#08040f] text-sm text-purple-200">{t.loading}</main>;
  }

  return (
    <main dir={s.lang === "ar" ? "rtl" : "ltr"} className="min-h-screen bg-[#08040f] pb-24 text-white">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-purple-500/20 bg-[#0b0615]/95 px-4 py-3.5 backdrop-blur">
        <button type="button" onClick={() => router.back()} className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-950/70 text-lg text-purple-200">‹</button>
        <h1 className="text-base font-bold">{t.title}</h1>
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-purple-950/70 text-purple-200">
          <span>🔔</span>
          {s.notifications_enabled && <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold">3</span>}
        </div>
      </header>

      <div className="mx-auto max-w-xl space-y-5 px-4 pt-4">
        {msg && (
          <div className="flex items-center justify-between rounded-2xl border border-purple-400/35 bg-purple-600/20 px-4 py-3 text-xs text-purple-100">
            <span>{saving ? t.syncing : msg}</span>
            <button type="button" onClick={() => setMsg(null)} className="ml-3 text-purple-300">✕</button>
          </div>
        )}

        <section className="flex items-center justify-between rounded-2xl border border-purple-500/30 bg-gradient-to-r from-[#1e1038] to-[#120922] p-4 shadow-lg">
          <div className="flex items-center gap-3.5">
            <label className="relative cursor-pointer">
              <img src={s.avatar_url || "https://placehold.co/72x72/2b1652/d8b4fe?text=FP"} alt={s.display_name} className="h-16 w-16 rounded-full border-2 border-purple-400/70 object-cover" />
              <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold">✎</span>
              <input type="file" accept="image/*" onChange={onAvatar} className="hidden" />
            </label>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold">{s.display_name}</h2>
                <span className="text-sm text-amber-400">👑</span>
              </div>
              <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-purple-400/35 bg-purple-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-purple-200">♦ {plan}</span>
              <p className="mt-1 text-[11px] text-purple-300/75">ID : FIT-{user?.id?.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
          <span className="text-xl text-purple-300/70">›</span>
        </section>

        <section className="space-y-1.5">
          <h3 className="px-1 text-xs font-semibold uppercase tracking-wider text-purple-300/85">⚙ {t.appSettings}</h3>
          <div className="divide-y divide-purple-500/15 overflow-hidden rounded-2xl border border-purple-500/20 bg-[#130b22]">
            <button type="button" onClick={cycleLang} className="flex w-full items-center justify-between px-4 py-3.5 text-left">
              <div><p className="text-sm font-medium">🌐 {t.language}</p><p className="text-xs text-purple-300/70">{LANG_LABELS[s.lang]}</p></div>
              <span className="text-lg text-purple-300/60">›</span>
            </button>

            <div className="flex items-center justify-between px-4 py-3.5">
              <div><p className="text-sm font-medium">🎨 {t.theme}</p><p className="text-xs text-purple-300/70">{t.themeDark}</p></div>
              <button type="button" onClick={() => toggle("dark_mode")} className={`h-6 w-11 rounded-full p-0.5 ${s.dark_mode ? "bg-purple-600" : "bg-zinc-700"}`}>
                <span className={`block h-5 w-5 rounded-full bg-white transition ${s.dark_mode ? "translate-x-5" : ""}`} />
              </button>
            </div>

            <div className="flex items-center justify-between px-4 py-3.5">
              <div><p className="text-sm font-medium">▶ {t.autoplay}</p><p className="text-xs text-purple-300/70">{t.autoplayDesc}</p></div>
              <button type="button" onClick={() => toggle("autoplay_videos")} className={`h-6 w-11 rounded-full p-0.5 ${s.autoplay_videos ? "bg-purple-600" : "bg-zinc-700"}`}>
                <span className={`block h-5 w-5 rounded-full bg-white transition ${s.autoplay_videos ? "translate-x-5" : ""}`} />
              </button>
            </div>

            <button type="button" onClick={cycleQuality} className="flex w-full items-center justify-between px-4 py-3.5 text-left">
              <div><p className="text-sm font-medium">🎬 {t.quality}</p><p className="text-xs text-purple-300/70">{s.video_quality}</p></div>
              <span className="text-lg text-purple-300/60">›</span>
            </button>

            <div className="flex items-center justify-between px-4 py-3.5">
              <div><p className="text-sm font-medium">🔔 {t.notifications}</p><p className="text-xs text-purple-300/70">{t.notificationsDesc}</p></div>
              <button type="button" onClick={() => toggle("notifications_enabled")} className={`h-6 w-11 rounded-full p-0.5 ${s.notifications_enabled ? "bg-purple-600" : "bg-zinc-700"}`}>
                <span className={`block h-5 w-5 rounded-full bg-white transition ${s.notifications_enabled ? "translate-x-5" : ""}`} />
              </button>
            </div>

            <div className="flex items-center justify-between px-4 py-3.5">
              <div><p className="text-sm font-medium">🔊 {t.sound}</p><p className="text-xs text-purple-300/70">{t.soundDesc}</p></div>
              <button type="button" onClick={() => toggle("sound_enabled")} className={`h-6 w-11 rounded-full p-0.5 ${s.sound_enabled ? "bg-purple-600" : "bg-zinc-700"}`}>
                <span className={`block h-5 w-5 rounded-full bg-white transition ${s.sound_enabled ? "translate-x-5" : ""}`} />
              </button>
            </div>

            <div className="flex items-center justify-between px-4 py-3.5">
              <div><p className="text-sm font-medium">🔋 {t.powerSaver}</p><p className="text-xs text-purple-300/70">{t.powerSaverDesc}</p></div>
              <button type="button" onClick={() => toggle("power_saver")} className={`h-6 w-11 rounded-full p-0.5 ${s.power_saver ? "bg-purple-600" : "bg-zinc-700"}`}>
                <span className={`block h-5 w-5 rounded-full bg-white transition ${s.power_saver ? "translate-x-5" : ""}`} />
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-1.5">
          <h3 className="px-1 text-xs font-semibold uppercase tracking-wider text-purple-300/85">🔒 {t.privacySection}</h3>
          <div className="divide-y divide-purple-500/15 overflow-hidden rounded-2xl border border-purple-500/20 bg-[#130b22]">
            <button type="button" onClick={() => saveAll(s, t.cloudSaved)} className="flex w-full items-center justify-between px-4 py-3.5 text-left">
              <div><p className="text-sm font-medium">☁ {t.backup}</p><p className="text-xs text-purple-300/70">{t.backupDesc}</p></div>
              <span className="text-lg text-purple-300/60">›</span>
            </button>
            <button type="button" onClick={() => saveAll(s, t.cloudRestored)} className="flex w-full items-center justify-between px-4 py-3.5 text-left">
              <div><p className="text-sm font-medium">↺ {t.restore}</p><p className="text-xs text-purple-300/70">{t.restoreDesc}</p></div>
              <span className="text-lg text-purple-300/60">›</span>
            </button>
            <button type="button" onClick={() => setSupportOpen(true)} className="flex w-full items-center justify-between px-4 py-3.5 text-left">
              <div><p className="text-sm font-medium text-rose-300">🗑 {t.deleteAccount}</p><p className="text-xs text-purple-300/70">{t.deleteAccountDesc}</p></div>
              <span className="text-lg text-purple-300/60">›</span>
            </button>
            <button type="button" onClick={() => router.push("/confidentialite")} className="flex w-full items-center justify-between px-4 py-3.5 text-left">
              <div><p className="text-sm font-medium">🛡 {t.privacyPolicy}</p><p className="text-xs text-purple-300/70">{t.privacyPolicyDesc}</p></div>
              <span className="text-lg text-purple-300/60">›</span>
            </button>
            <button type="button" onClick={() => router.push("/conditions")} className="flex w-full items-center justify-between px-4 py-3.5 text-left">
              <div><p className="text-sm font-medium">📄 {t.terms}</p><p className="text-xs text-purple-300/70">{t.termsDesc}</p></div>
              <span className="text-lg text-purple-300/60">›</span>
            </button>
          </div>
        </section>

        <section className="space-y-1.5">
          <h3 className="px-1 text-xs font-semibold uppercase tracking-wider text-purple-300/85">? {t.supportSection}</h3>
          <div className="divide-y divide-purple-500/15 overflow-hidden rounded-2xl border border-purple-500/20 bg-[#130b22]">
            <button type="button" onClick={() => setSupportOpen(true)} className="flex w-full items-center justify-between px-4 py-3.5 text-left">
              <div><p className="text-sm font-medium">🎧 {t.helpCenter}</p><p className="text-xs text-purple-300/70">{t.helpCenterDesc}</p></div>
              <span className="text-lg text-purple-300/60">›</span>
            </button>
            <button type="button" onClick={() => setSupportOpen(true)} className="flex w-full items-center justify-between px-4 py-3.5 text-left">
              <div><p className="text-sm font-medium">✉ {t.contactSupport}</p><p className="text-xs text-purple-300/70">{t.contactSupportDesc}</p></div>
              <span className="text-lg text-purple-300/60">›</span>
            </button>
            <div className="flex items-center justify-between px-4 py-3.5">
              <div><p className="text-sm font-medium">ℹ {t.about}</p><p className="text-xs text-purple-300/70">{t.aboutDesc}</p></div>
              <span className="text-lg text-purple-300/60">›</span>
            </div>
          </div>
        </section>

        <button type="button" onClick={signOut} className="w-full rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 py-3.5 text-sm font-bold text-white shadow-lg">
          ↪ {t.signOut}
        </button>
      </div>

      {supportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <form onSubmit={sendTicket} className="w-full max-w-md space-y-3 rounded-2xl border border-purple-500/30 bg-[#150c26] p-5 text-white">
            <h4 className="text-base font-bold">{t.modalTitle}</h4>
            <input type="text" required value={subject} onChange={(e) => setSubject(e.target.value)} placeholder={t.subjectPlaceholder} className="w-full rounded-xl border border-purple-500/25 bg-[#0c0716] px-3 py-2.5 text-sm outline-none" />
            <textarea rows={3} required value={body} onChange={(e) => setBody(e.target.value)} placeholder={t.messagePlaceholder} className="w-full rounded-xl border border-purple-500/25 bg-[#0c0716] px-3 py-2.5 text-sm outline-none" />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setSupportOpen(false)} className="rounded-xl bg-white/10 px-4 py-2 text-xs text-purple-200">{t.cancel}</button>
              <button type="submit" className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold">{t.send}</button>
            </div>
          </form>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-around border-t border-purple-500/20 bg-[#0b0615]/95 py-2.5 text-[11px] backdrop-blur">
        <button type="button" onClick={() => router.push("/dashboard")} className="flex flex-col items-center gap-0.5 text-zinc-400"><span>⌂</span><span>{t.navHome}</span></button>
        <button type="button" onClick={() => router.push("/entrainement")} className="flex flex-col items-center gap-0.5 text-zinc-400"><span>🏋</span><span>{t.navWorkout}</span></button>
        <button type="button" onClick={() => router.push("/progres")} className="flex flex-col items-center gap-0.5 text-zinc-400"><span>◎</span><span>{t.navProgress}</span></button>
        <button type="button" onClick={() => router.push("/premium")} className="flex flex-col items-center gap-0.5 text-zinc-400"><span>👑</span><span>{t.navPremium}</span></button>
        <button type="button" className="flex flex-col items-center gap-0.5 font-semibold text-purple-400"><span>⚙</span><span>{t.navSettings}</span></button>
      </nav>
    </main>
  );
      }
        
