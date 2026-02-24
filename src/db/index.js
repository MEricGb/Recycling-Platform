const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../reciclare.db');

let db = null;

async function initDatabase() {
  const SQL = await initSqlJs();

  // Load existing database or create new one
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  // Load and execute schema
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  db.run(schema);

  // Insert default events if empty
  const result = db.exec('SELECT COUNT(*) as count FROM events');
  const count = result[0]?.values[0][0] || 0;

  if (count === 0) {
    db.run("INSERT INTO events (title, date, location) VALUES ('Curățenie în parc', '2025-02-15', 'Parcul Central')");
    db.run("INSERT INTO events (title, date, location) VALUES ('Workshop reciclare', '2025-02-20', 'Biblioteca Municipală')");
    db.run("INSERT INTO events (title, date, location) VALUES ('Colectare electronice', '2025-03-01', 'Piața Unirii')");
    saveDatabase();
  }

  // Insert default quiz questions if empty
  const questionCount = db.exec('SELECT COUNT(*) as count FROM quiz_questions');
  const qCount = questionCount[0]?.values[0][0] || 0;

  if (qCount === 0) {
    db.run("INSERT INTO quiz_questions (question, answer_a, answer_b, answer_c, answer_d, correct) VALUES ('Ce culoare are containerul pentru sticlă în majoritatea schemelor de reciclare din România?', 'Albastru', 'Verde', 'Galben', 'Roșu', 1)");
    db.run("INSERT INTO quiz_questions (question, answer_a, answer_b, answer_c, answer_d, correct) VALUES ('Care material NU poate fi reciclat eficient?', 'Aluminiu', 'Carton', 'Plastic PET', 'Sticlă murdară', 3)");
    db.run("INSERT INTO quiz_questions (question, answer_a, answer_b, answer_c, answer_d, correct) VALUES ('Cât timp durează descompunerea unei pungi de plastic?', '10 ani', '50 ani', '100-500 ani', '1000 ani', 2)");
    db.run("INSERT INTO quiz_questions (question, answer_a, answer_b, answer_c, answer_d, correct) VALUES ('Ce tip de plastic este cel mai reciclat?', 'PVC', 'PET', 'PS', 'PP', 1)");
    db.run("INSERT INTO quiz_questions (question, answer_a, answer_b, answer_c, answer_d, correct) VALUES ('În ce container arunci hârtia și cartonul?', 'Verde', 'Galben', 'Albastru', 'Negru', 2)");
    saveDatabase();
  }

  console.log('✓ SQLite database ready');
  return db;
}

function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  }
}

function getDb() {
  return db;
}

// Helper functions that match better-sqlite3 API style
function prepare(sql) {
  return {
    run(...params) {
      db.run(sql, params);
      saveDatabase();
      const result = db.exec('SELECT last_insert_rowid()');
      return { lastInsertRowid: result[0]?.values[0][0] };
    },
    get(...params) {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      if (stmt.step()) {
        const row = stmt.getAsObject();
        stmt.free();
        return row;
      }
      stmt.free();
      return undefined;
    },
    all(...params) {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      const rows = [];
      while (stmt.step()) {
        rows.push(stmt.getAsObject());
      }
      stmt.free();
      return rows;
    }
  };
}

module.exports = {
  initDatabase,
  getDb,
  prepare,
  saveDatabase
};
