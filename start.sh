until node start.js &> output.txt; do
    echo "Server 'start.js' crashed with exit code $?.  Respawning.." >&2
    sleep 1
done
