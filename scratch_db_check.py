import psycopg2

try:
    conn = psycopg2.connect("postgresql://postgres:postgres@localhost:5433/kickbunk_customer")
    cur = conn.cursor()
    cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;")
    tables = [r[0] for r in cur.fetchall()]
    print("TABLES_FOUND:", len(tables))
    for t in tables:
        print(" -", t)
    conn.close()
except Exception as e:
    print("ERROR:", e)
