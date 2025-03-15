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