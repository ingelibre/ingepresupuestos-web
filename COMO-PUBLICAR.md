# Cómo publicar la web (ingepresupuestos.com)

Guía simple para publicar los cambios de la página. No necesitas saber programar.

## Publicar (lo normal)

1. Abre una **Terminal**.
2. Copia y pega esta línea, y dale Enter:

   ```
   cd ~/ingepresupuestos-web && npx wrangler deploy
   ```

3. Espera unos segundos. Cuando veas al final:

   ```
   ✨ Success! ... Deployed ingepresupuestos-web
   ```

   ¡Ya está publicado! Los cambios salen en vivo en segundos.

Para comprobarlo, abre https://ingepresupuestos.com y recarga con **Ctrl + Shift + R**
(eso salta la caché del navegador y te muestra la versión nueva).

## La primera vez en una computadora nueva

Si te sale un mensaje de que "no estás autenticado" (not authenticated),
primero corre esto UNA vez (abre el navegador para autorizar con tu cuenta
de Cloudflare, la de ing.sumari@gmail.com):

```
npx wrangler login
```

Dale "Allow / Autorizar" en el navegador y luego repite el paso de publicar.

## Si pregunta por la cuenta

Si te pregunta cuál cuenta usar, corre esto y vuelve a publicar:

```
export CLOUDFLARE_ACCOUNT_ID=f8530318482c548aa30f831b6f81a42d
cd ~/ingepresupuestos-web && npx wrangler deploy
```

## Notas

- Esto sube **toda la carpeta** `~/ingepresupuestos-web/` tal como está en tu disco.
  Guarda tus cambios en los archivos ANTES de publicar.
- No hace falta hacer `git push` para publicar; son cosas distintas
  (git guarda el historial, wrangler publica la web).
- Claude también puede correr este comando por ti: solo dile "publica la web".
