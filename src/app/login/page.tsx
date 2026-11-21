  const [resetMessage, setResetMessage] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const handleForgotPassword = async () => {
    setResetMessage("");
    if (!email.trim()) {
      setResetMessage("Entre ton adresse e-mail ci-dessus puis clique sur Mot de passe oublié.");
      return;
    }

    setResetLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setResetLoading(false);

    if (error) {
      setResetMessage(error.message);
      return;
    }

    playSuccess?.();
    setResetMessage("Lien de réinitialisation envoyé dans ta boîte Gmail !");
  };
