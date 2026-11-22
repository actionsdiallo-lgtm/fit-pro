import { handlers } from "@/auth";
export const { GET, POST } = handlers;
```[span_1](start_span)[span_1](end_span)

### Bilan de la partie connexion côté code
* **`src/app/api/auth/[...nextauth]/route.ts`** : exporte proprement `GET` et `POST` depuis `@/auth`[span_2](start_span)[span_2](end_span).
* **`src/auth.ts`** : vérifie les mots de passe (`scrypt` + compatibilité `bcryptjs`) avec `import crypto from "crypto"` en minuscule et `credentialsSchema`[span_3](start_span)[span_3](end_span).
* **`src/app/login/page.tsx`** : gère la connexion NextAuth (`signIn`) et le parcours OTP à 6 chiffres (`login` / `forgot` / `verify` / `reset`)[span_4](start_span)[span_4](end_span).
* **`src/app/register/page.tsx`** et **`src/app/api/register/route.ts`** : inscrivent l'utilisateur proprement avec hachage `scrypt` et `prisma`[span_5](start_span)[span_5](end_span)[span_6](start_span)[span_6](end_span).
* **`src/middleware.ts`** : laisse passer sans boucle de redirection.

Veux-tu qu'on vérifie maintenant l'une des routes de récupération (`forgot-password`, `resend-reset-code`, `verify-reset-code` ou `reset-password`), ou es-tu prêt à passer aux tests en ligne ?
  
