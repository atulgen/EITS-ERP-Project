# 📦 Exporting Client Script to Your Custom App (Frappe)

Follow these steps to export your **Client Script** from the UI to your custom app as a fixture.

---

## ✅ Step 1: Open the Client Script Doctype

1. Visit your site in the browser:

   ```
   http://<your-site>:8000/app/client-script
   ```

2. Search and open the Client Script you created.

3. Note the **name** (e.g., `Client Script for Sales Invoice`).

---

## ⚠️ Step 2: Check If the Script Is Marked as Custom

If your script is marked as **custom**, it won’t be exported by default.

### Open the Frappe Console

```bash
bench --site <your-site> console
```

### Then run inside the console:

```python
frappe.get_doc("Client Script", "Client Script for Sales Invoice")
```

Replace `"Client Script for Sales Invoice"` with your actual script name.

---

## 🧩 Step 3: Add Script to Fixtures in `hooks.py`

Open your app’s `hooks.py` file:

```
apps/your_app/your_app/hooks.py
```

And add this:

```python
fixtures = [
    {
        "doctype": "Client Script",
        "filters": [
            ["name", "in", [
                "Client Script for Sales Invoice",
                "Client Script for Quotation"
            ]]
        ]
    }
]
```

---

## 📤 Step 4: Export the Fixtures

Run this command to export your Client Script to a JSON file:

```bash
bench --site <your-site> export-fixtures
```

This will create `.json` files at:

```
your_app/your_app/fixtures/
```

Example output file:

```
Client Script.json
```

---

## 📁 Step 5: Add & Commit to Git

Use Git to track and push the exported script:

```bash
git add your_app/your_app/fixtures/*
git commit -m "Exported client scripts"
git push
```

---

## 🔄 Optional: Re-import the Fixture on Another Site

If you pull this app on another system/site, run:

```bash
bench --site <your-site> migrate
```

This will read the fixture JSON files and insert the data into the database.

---

> ✅ You're all set! Now your Client Script is part of version control and deployable anywhere.
