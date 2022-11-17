# NExt.js OpenJira App

For local run, need the base date

```

docker-compose up -d
```

* The -d, it means __detached__

MongoDB URL Local:

```

mongodb://localhost:27017/entriesdb
```

## Configure the environment variables
Rename file __.env.template__ to __.env__

## Fill the data base with test info

Call to:
```
http://localhost:3000/api/seed
```