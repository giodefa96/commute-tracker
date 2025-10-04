# Script di esempio per creare file HTML per Privacy Policy su GitHub Pages

# 1. Crea la directory docs se non esiste
mkdir -p docs

# 2. Converti il markdown in HTML (opzione manuale)
cat > docs/privacy-policy.html << 'EOF'
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - Commute Tracker</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1 { color: #2196F3; }
        h2 { color: #1976D2; margin-top: 30px; }
        h3 { color: #1565C0; }
        code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
    </style>
</head>
<body>
    <h1>Privacy Policy per Commute Tracker</h1>
    <p><strong>Data di entrata in vigore</strong>: 4 Ottobre 2025</p>
    
    <h2>1. Introduzione</h2>
    <p>Commute Tracker ("noi", "l'app") si impegna a proteggere la privacy dei suoi utenti. Questa Privacy Policy descrive come raccogliamo, utilizziamo e proteggiamo le informazioni quando utilizzi la nostra applicazione mobile.</p>
    
    <h2>2. Raccolta dei Dati</h2>
    <h3>2.1 Dati Raccolti Localmente</h3>
    <p>Commute Tracker raccoglie e memorizza i seguenti dati <strong>esclusivamente sul tuo dispositivo</strong>:</p>
    <ul>
        <li><strong>Orari di viaggio</strong>: orari di partenza, arrivi alla fermata, arrivi del mezzo pubblico, e arrivi a destinazione</li>
        <li><strong>Tipo di viaggio</strong>: distinzione tra viaggi di andata e ritorno</li>
        <li><strong>Date dei viaggi</strong>: date associate ai tuoi spostamenti</li>
        <li><strong>Percorsi salvati</strong>: nomi e informazioni sui percorsi personalizzati che hai creato</li>
    </ul>
    
    <h3>2.2 Dati NON Raccolti</h3>
    <p>L'app <strong>NON</strong> raccoglie, trasmette o condivide:</p>
    <ul>
        <li>Informazioni personali identificabili</li>
        <li>Dati di localizzazione GPS</li>
        <li>Informazioni di contatto</li>
        <li>Nessun dato con server esterni o terze parti</li>
    </ul>
    
    <h2>3. Utilizzo dei Dati</h2>
    <p>I dati raccolti vengono utilizzati esclusivamente per:</p>
    <ul>
        <li>Visualizzare la cronologia dei tuoi viaggi</li>
        <li>Calcolare statistiche sui tempi di percorrenza</li>
        <li>Permetterti di filtrare e analizzare i tuoi spostamenti</li>
        <li>Migliorare la tua esperienza nell'app</li>
    </ul>
    
    <h2>4. Archiviazione dei Dati</h2>
    <p>Tutti i dati sono archiviati localmente sul tuo dispositivo utilizzando un database SQLite. I dati:</p>
    <ul>
        <li><strong>NON</strong> vengono caricati su server cloud</li>
        <li><strong>NON</strong> vengono condivisi con terze parti</li>
        <li><strong>NON</strong> vengono utilizzati per scopi pubblicitari</li>
        <li>Rimangono completamente sotto il tuo controllo</li>
    </ul>
    
    <h2>5. Sicurezza</h2>
    <p>I tuoi dati sono protetti dalle misure di sicurezza standard del tuo dispositivo Android. Poiché i dati sono memorizzati solo localmente, la sicurezza dipende dalle impostazioni di sicurezza del tuo dispositivo.</p>
    
    <h2>6. Autorizzazioni dell'App</h2>
    <p>L'app richiede le seguenti autorizzazioni:</p>
    <ul>
        <li><strong>VIBRATE</strong>: per fornire feedback tattile durante l'utilizzo dell'app</li>
        <li><strong>Nessuna autorizzazione di rete</strong>: l'app funziona completamente offline</li>
    </ul>
    
    <h2>7. Eliminazione dei Dati</h2>
    <p>Puoi eliminare i tuoi dati in qualsiasi momento:</p>
    <ul>
        <li>Elimina singoli viaggi dall'app</li>
        <li>Disinstalla l'app per rimuovere tutti i dati memorizzati</li>
    </ul>
    
    <h2>8. Modifiche a Questa Privacy Policy</h2>
    <p>Potremmo aggiornare questa Privacy Policy periodicamente. Ti informeremo di eventuali modifiche pubblicando la nuova Privacy Policy in questa pagina e aggiornando la "Data di entrata in vigore".</p>
    
    <h2>9. Contatti</h2>
    <p>Se hai domande su questa Privacy Policy, puoi contattarci a:</p>
    <ul>
        <li><strong>Email</strong>: [TUA-EMAIL@example.com]</li>
        <li><strong>Repository GitHub</strong>: <a href="https://github.com/giodefa96/commute-tracker">https://github.com/giodefa96/commute-tracker</a></li>
    </ul>
    
    <h2>10. Conformità</h2>
    <p>Questa app è conforme alle normative:</p>
    <ul>
        <li>GDPR (Regolamento Generale sulla Protezione dei Dati)</li>
        <li>Google Play Developer Program Policies</li>
    </ul>
    
    <hr>
    <p><em>Ultima revisione: 4 Ottobre 2025</em></p>
</body>
</html>
EOF

echo "✅ File privacy-policy.html creato in docs/"
echo ""
echo "📝 Prossimi passi:"
echo "1. Modifica l'email di contatto nel file"
echo "2. Commit e push su GitHub"
echo "3. Vai su Settings > Pages nel repository"
echo "4. Abilita GitHub Pages dalla cartella 'docs'"
echo "5. L'URL sarà: https://giodefa96.github.io/commute-tracker/privacy-policy.html"
