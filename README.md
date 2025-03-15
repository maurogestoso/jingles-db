# Fabrica de Jingles DB

## Desarrollo

### Base de Datos

Como hacer `dump` de la base de datos en Turso:

```bash
turso db shell jingles .dump > dump.sql
```

Como hacer `dump` de la base de datos local:

```bash
sqlite3 local.db ".dump" > local-db_dump.sql
```

> ⚠️ Como dijo el poeta Ben Parker: **Un gran poder conlleva una gran responsabilidad**

Como cargar un dump local a la base de datos en Turso:

```bash
turso db shell jingles < local-db_dump.sql
```

### Como uso prompts de LLMs para obtener datos

Parandome en los hombros de gigantes, utilizo los comentarios de cada video en los que se detallan los `timestamps`, canciones, artistas y autores de cada jingle. Copio el comentario, la URL del video y la fecha de publicacion (en la descripcion) y los pego en el prompt `prompts/extract-timestamps.txt`. De momento este proceso es bastante artesanal y requiere prestar atencion al formato del comentario (que no siempre es el mismo) y ajustar el prompt. Con el JSON que devuelve ChatGPT creo un archivo en `app/db/seed` y lo utilizo como argumento para el script `app/db/seed.ts`

```markdown
prompts/extract-timestamps.txt

I have a YouTube video that is an episode of a radio show. I want to extract information about all the songs that were played to store it in a database. I want a JSON object with the URL ("youtube_url") of the episode, the date ("date"), and a list of songs ("songs").

<url>
➡️ Aca la URL (formato "https://www.youtube.com/watch?v=x90T9A1ipq8")
</url>

<date>
➡️ Aca la fecha (formato "18 Jul 2024")
</date>

This is a list of segments of the YouTube video with timestamps, song titles, song artist and an author in parenthesis (optional). I want you to transform this into a JSON array of objects with properties "timestamp", "name", "artist" and "author". You can ignore everything else. Timestamps should be converted to seconds.

For example:

<example_input>
4:12 Atrévete-te-te - Calle 13 (Pedrillom)
</example_input>

should be:

<example_json_output>
{
"timestamp": 252,
"song": "Atrévete-te-te",
"artist": "Calle 13",
"author": "Pedrillom"
}
</example_json_output>

<song_list>
➡️ Aca el comentario con la lista de jingles
</song_list>
```
