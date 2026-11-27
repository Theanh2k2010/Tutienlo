(() => {
  'use strict';

  const $ = (selector) => document.querySelector(selector);
  const canvas = $('#world');
  const ctx = canvas.getContext('2d', { alpha: false });
  const miniCanvas = $('#miniCanvas');
  const miniCtx = miniCanvas.getContext('2d');
  const modalRoot = $('#modalRoot');
  const toastEl = $('#toast');
  const logEl = $('#combatLog');

  const REALMS = [
    'Luyện Khí', 'Trúc Cơ', 'Kim Đan', 'Nguyên Anh', 'Hóa Thần', 'Luyện Hư',
    'Hợp Thể', 'Đại Thừa', 'Độ Kiếp', 'Tán Tiên', 'Địa Tiên', 'Thiên Tiên',
    'Chân Tiên', 'Huyền Tiên', 'Kim Tiên', 'Thái Ất Kim Tiên', 'Đại La Kim Tiên',
    'Tiên Vương', 'Tiên Đế', 'Chuẩn Thánh', 'Thánh Nhân', 'Thiên Đạo', 'Đại Đạo'
  ];

  const CLASSES = [
    { id: 'sword', name: 'Kiếm tu', icon: '🗡️', color: '#d9e8ff', skill: 'Kiếm Khí Trảm', glyph: '⚔', desc: 'Cận chiến mạnh, tăng sát thương kiếm và chí mạng.', bonus: 'Công kích +15%', atk: 1.15, def: 1, hp: 1, qi: 1 },
    { id: 'mortal', name: 'Phàm nhân', icon: '🧑', color: '#e0c49b', skill: 'Phàm Tâm Quyết', glyph: '✦', desc: 'Cân bằng, dễ tu luyện và thích nghi mọi công pháp.', bonus: 'EXP +10%', atk: 1.03, def: 1.08, hp: 1.08, qi: 1.1 },
    { id: 'ghost', name: 'Quỷ tu', icon: '👹', color: '#bb8bda', skill: 'U Minh Huyết Trảo', glyph: '☠', desc: 'Hút sinh lực khi tấn công, nhưng độ kiếp nguy hiểm hơn.', bonus: 'Hút máu 12%', atk: 1.1, def: .96, hp: 1, qi: 1 },
    { id: 'poison', name: 'Độc tu', icon: '🐍', color: '#9fe18e', skill: 'Vạn Độc Chưởng', glyph: '☣', desc: 'Gây độc theo thời gian, khắc chế mục tiêu nhiều máu.', bonus: 'Độc +20%', atk: 1.04, def: 1, hp: 1, qi: 1.08 },
    { id: 'alchemy', name: 'Đan tu', icon: '⚗️', color: '#ffc77d', skill: 'Linh Đan Bạo', glyph: '⚗', desc: 'Luyện đan, hồi phục và kiếm linh thạch từ dược liệu.', bonus: 'Hồi phục +25%', atk: 1, def: 1, hp: 1.03, qi: 1.2 },
    { id: 'archer', name: 'Cung tu', icon: '🏹', color: '#9ce5d0', skill: 'Xuyên Vân Tiễn', glyph: '➶', desc: 'Đánh xa, dễ giữ khoảng cách với yêu thú.', bonus: 'Tầm đánh +80%', atk: 1.08, def: .98, hp: 1, qi: 1 },
    { id: 'charm', name: 'Hợp hoan tu', icon: '🌸', color: '#f4a8ce', skill: 'Mê Tâm Linh Vũ', glyph: '❀', desc: 'Dùng linh vũ mê hoặc, làm chậm và suy yếu yêu thú.', bonus: 'Khống chế +20%', atk: 1.05, def: 1, hp: 1.02, qi: 1.1 }
  ];

  const ITEMS = {
    herb: { name: 'Thanh Linh Thảo', icon: '🌿', type: 'Nguyên liệu', desc: 'Dược liệu cấp thấp dùng luyện đan.', sell: 4 },
    stone: { name: 'Linh thạch hạ phẩm', icon: '💎', type: 'Tiền tệ', desc: 'Vật phẩm trao đổi phổ biến trong tu tiên giới.', sell: 1 },
    core: { name: 'Yêu thú nội đan', icon: '🔮', type: 'Nguyên liệu', desc: 'Nội đan của yêu thú, dùng chế tạo pháp bảo.', sell: 18 },
    ore: { name: 'Huyền Thiết', icon: '🪨', type: 'Nguyên liệu', desc: 'Khoáng thạch dùng luyện khí.', sell: 9 },
    pill: { name: 'Tụ Khí Đan', icon: '🧪', type: 'Đan dược', desc: 'Hồi 120 sinh lực và 35 linh khí.', sell: 12 },
    silk: { name: 'Linh Tằm Ti', icon: '🧵', type: 'Nguyên liệu', desc: 'Tơ của linh tằm, dùng chế tạo pháp y.', sell: 14 },
    frost: { name: 'Hàn Tinh', icon: '❄️', type: 'Nguyên liệu', desc: 'Tinh thể băng hệ, tìm thấy ở Băng Phong Cốc.', sell: 28 },
    ember: { name: 'Hỏa Tinh', icon: '🔥', type: 'Nguyên liệu', desc: 'Tinh thể hỏa hệ, tìm thấy ở Hỏa Vân Sơn.', sell: 32 },
    sword: { name: 'Thanh Phong Kiếm', icon: '🗡️', type: 'Phàm Khí', desc: 'Phàm khí được rèn cho người mới nhập môn.', sell: 30 },
    qi_sword: { name: 'Thanh Vân Linh Kiếm', icon: '⚔️', type: 'Linh Khí • Hạ phẩm', desc: 'Linh kiếm khắc trận văn sơ cấp, tăng uy lực kiếm chiêu.', sell: 70 },
    flying_sword: { name: 'Ngự Phong Phi Kiếm', icon: '🗡️', type: 'Pháp Bảo', desc: 'Phi kiếm có thể ngự không, linh quang lưu chuyển quanh thân.', sell: 180 },
    ancient_bell: { name: 'Nhiếp Hồn Cổ Chung', icon: '🔔', type: 'Cổ Bảo', desc: 'Cổ bảo có khí tức thần thức, có thể chấn nhiếp yêu hồn.', sell: 520 },
    heavenly_tower: { name: 'Trấn Yêu Thông Thiên Tháp', icon: '🏯', type: 'Thông Thiên Linh Bảo', desc: 'Linh bảo hiếm thấy, bên trong có khí linh trấn áp yêu vật.', sell: 1600 },
    immortal_shard: { name: 'Tiên Khí Tàn Phiến', icon: '💠', type: 'Tiên Khí', desc: 'Mảnh vỡ tiên khí mang theo một tia tiên vận.', sell: 4200 },
    chaos_core: { name: 'Hỗn Độn Bản Nguyên', icon: '🌌', type: 'Hỗn Độn Chí Bảo', desc: 'Bản nguyên chí bảo cực hiếm, chỉ xuất hiện trong truyền thuyết.', sell: 18000 }
  };

  const ZONES = [
    { id: 1, name: 'Thôn Thanh Trúc', title: 'Chương 1 • Sơ nhập tiên đồ', min: 1, max: 10, biome: 'green', desc: 'Rừng trúc, linh điền và những yêu thú cấp thấp.' },
    { id: 2, name: 'Băng Phong Cốc', title: 'Chương 2 • Hàn cốc bí cảnh', min: 10, max: 20, biome: 'ice', desc: 'Tuyết vực cổ xưa, yêu thú băng hệ canh giữ hàn tinh.' },
    { id: 3, name: 'Hỏa Vân Sơn', title: 'Chương 3 • Viêm sơn địa mạch', min: 20, max: 30, biome: 'fire', desc: 'Núi lửa và địa mạch, nơi sinh ra hỏa tinh hiếm.' }
  ];

  const MONSTERS = {
    1: [
      { id: 'woodling', name: 'Mộc Linh Đà', shape: 'sprout', color: '#77c66c', accent: '#d7f29a', hp: 54, atk: 7, exp: 24, coins: 5, drop: 'herb' },
      { id: 'stonewolf', name: 'Thạch Nha Lang', shape: 'stonefang', color: '#83959b', accent: '#d5dfe2', hp: 82, atk: 11, exp: 32, coins: 7, drop: 'ore' },
      { id: 'mistfrog', name: 'Độc Vụ Oa', shape: 'frog', color: '#83b768', accent: '#c5ed83', hp: 68, atk: 9, exp: 29, coins: 6, drop: 'herb' },
      { id: 'bamboosnake', name: 'Bích Trúc Xà', shape: 'snake', color: '#5cae71', accent: '#d2db75', hp: 62, atk: 10, exp: 28, coins: 6, drop: 'silk' },
      { id: 'bloodfox', name: 'Huyết Diệp Hồ', shape: 'fox', color: '#c85d4d', accent: '#f4ad76', hp: 100, atk: 13, exp: 40, coins: 9, drop: 'core' },
      { id: 'rockrhino', name: 'Cự Nham Tê', shape: 'cliffrhino', color: '#8a8275', accent: '#d6bd8e', hp: 138, atk: 16, exp: 52, coins: 12, drop: 'ore' }
    ],
    2: [
      { id: 'frostbear', name: 'Băng Giáp Hùng', shape: 'bear', color: '#6aa6c9', accent: '#d5f4ff', hp: 190, atk: 22, exp: 82, coins: 17, drop: 'frost' },
      { id: 'icewidow', name: 'Hàn Tinh Chu', shape: 'spider', color: '#729acb', accent: '#dbf2ff', hp: 154, atk: 20, exp: 75, coins: 15, drop: 'silk' },
      { id: 'frostbird', name: 'Sương Dực Điểu', shape: 'bird', color: '#a8d6e7', accent: '#ffffff', hp: 170, atk: 25, exp: 88, coins: 18, drop: 'frost' },
      { id: 'icefang', name: 'Huyền Băng Ngạc', shape: 'croc', color: '#477da7', accent: '#c6f3ff', hp: 235, atk: 27, exp: 104, coins: 20, drop: 'core' },
      { id: 'snowwolf', name: 'Tuyết Ma Lang', shape: 'snowwolf', color: '#8bb4db', accent: '#eafaff', hp: 210, atk: 29, exp: 110, coins: 22, drop: 'frost' },
      { id: 'iceelephant', name: 'Huyền Băng Tượng', shape: 'iceelephant', color: '#5790b9', accent: '#b5e4fa', hp: 310, atk: 34, exp: 135, coins: 26, drop: 'core' }
    ],
    3: [
      { id: 'emberfox', name: 'Liệt Diễm Hồ', shape: 'emberfox', color: '#d75c36', accent: '#ffd36b', hp: 350, atk: 38, exp: 160, coins: 28, drop: 'ember' },
      { id: 'magma', name: 'Dung Nham Khôi', shape: 'golem', color: '#9a4630', accent: '#ffad45', hp: 470, atk: 42, exp: 190, coins: 32, drop: 'ore' },
      { id: 'firebird', name: 'Xích Vũ Ưng', shape: 'firebird', color: '#d94c31', accent: '#ffe58d', hp: 390, atk: 44, exp: 180, coins: 31, drop: 'ember' },
      { id: 'flamewidow', name: 'Hỏa Tinh Chu', shape: 'flamewidow', color: '#b94738', accent: '#ffca72', hp: 420, atk: 46, exp: 194, coins: 34, drop: 'silk' },
      { id: 'fire rhino', name: 'Viêm Giáp Tê', shape: 'emberrhino', color: '#9d4934', accent: '#ffc45d', hp: 520, atk: 50, exp: 220, coins: 38, drop: 'ember' },
      { id: 'earthdragon', name: 'Địa Tâm Long', shape: 'dragon', color: '#753b39', accent: '#ffcf64', hp: 680, atk: 58, exp: 270, coins: 45, drop: 'core' }
    ]
  };

  const SECTS = [
    { name: 'Thanh Vân Môn', type: 'Chính đạo • Kiếm tu', icon: '⛰️', bonus: 'Công kích +5%', desc: 'Tông môn kiếm đạo nằm giữa quần phong.' },
    { name: 'Dược Vương Cốc', type: 'Đan đạo • Y tu', icon: '🌿', bonus: 'Luyện đan +10%', desc: 'Nơi hội tụ linh dược và luyện đan sư.' },
    { name: 'Thục Sơn Kiếm Phái', type: 'Chính đạo • Kiếm tu', icon: '🗡️', bonus: 'Chí mạng +4%', desc: 'Lấy kiếm nhập đạo, kiếm ý sắc bén.' },
    { name: 'Vạn Độc Môn', type: 'Tà phái • Độc tu', icon: '☣️', bonus: 'Độc thương +10%', desc: 'Ẩn mình trong chướng khí vạn độc.' },
    { name: 'Quỷ Vương Tông', type: 'Ma đạo • Quỷ tu', icon: '💀', bonus: 'Hút máu +3%', desc: 'Tu luyện u minh bí pháp, bị chính đạo truy xét.' },
    { name: 'Vạn Bảo Lâu', type: 'Trung lập • Thương hội', icon: '🏮', bonus: 'Mua bán rẻ hơn 5%', desc: 'Thương hội trải rộng khắp tu tiên giới.' }
  ];

  const DEFAULT_STATE = {
    created: false, name: 'Đạo hữu', gender: 'male', classId: 'sword', level: 1, xp: 0,
    hp: 300, hpMax: 300, qi: 20, qiMax: 100, realmIndex: 0, realmStep: 1,
    stones: 35, coins: 120, chapter: 1, x: 800, y: 970, facing: 1,
    inventory: { herb: 5, stone: 35, pill: 2, sword: 1 }, auto: false,
    questKills: 0, questClaimed: false, totalKills: 0, totalCultivations: 0,
    sect: '', skillPoints: 0, unlockedSkills: [], achievements: [],
    settings: { quality: 'high', sound: false, particles: true },
    weapon: 'sword', targetId: null, lastSave: 0
  };

  function deepClone(value) { return JSON.parse(JSON.stringify(value)); }
  function loadState() {
    try {
      const raw = localStorage.getItem('tienlo_pixel_save_v1');
      if (!raw) return deepClone(DEFAULT_STATE);
      const parsed = JSON.parse(raw);
      return { ...deepClone(DEFAULT_STATE), ...parsed,
        settings: { ...DEFAULT_STATE.settings, ...(parsed.settings || {}) },
        inventory: { ...DEFAULT_STATE.inventory, ...(parsed.inventory || {}) } };
    } catch (err) {
      console.warn('Save data could not be read:', err);
      return deepClone(DEFAULT_STATE);
    }
  }

  let state = loadState();
  let selectedClass = state.classId;
  let selectedGender = state.gender;
  let draftName = state.created ? state.name : '';
  let monsters = [];
  let drops = [];
  let particles = [];
  let camera = { x: 0, y: 0 };
  let screenW = 0, screenH = 0, dpr = 1;
  let lastFrame = 0, elapsed = 0, toastTimer = 0, spawnTimer = 0;
  let attackCooldown = 0, skillCooldown = 0, regenTimer = 0, targetFlash = 0;
  let moveTarget = null;
  let input = { up: false, down: false, left: false, right: false };
  let modalName = '';
  let currentTarget = null;
  let dayPhase = 0;
  let toastTimeout = null;
  let lastLogText = '';

  const CLASS = () => CLASSES.find(c => c.id === state.classId) || CLASSES[0];
  const zone = () => ZONES.find(z => z.id === state.chapter) || ZONES[0];
  const levelCap = 30;
  const xpNeeded = () => 80 + state.level * 42;
  const playerPower = () => Math.round((48 + state.level * 18 + state.realmIndex * 17 + state.realmStep * 3) * CLASS().atk);
  const playerAttack = () => Math.round((23 + state.level * 5 + state.realmIndex * 12 + state.realmStep * 2) * CLASS().atk);
  const playerDefense = () => Math.round((5 + state.level * 2 + state.realmIndex * 5) * CLASS().def);
  const attackRange = () => state.classId === 'archer' ? 210 : state.classId === 'poison' ? 126 : 88;

  function saveGame(force = false) {
    const now = Date.now();
    if (!force && now - state.lastSave < 1800) return;
    state.lastSave = now;
    try { localStorage.setItem('tienlo_pixel_save_v1', JSON.stringify(state)); }
    catch (err) { console.warn('Save failed:', err); }
  }

  function toast(message, duration = 1800) {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toastEl.classList.remove('show'), duration);
  }

  function log(message, type = 'system') {
    const cls = type === 'good' ? 'log-good' : type === 'loot' ? 'log-loot' : 'log-system';
    const p = document.createElement('p');
    p.innerHTML = `<span class="${cls}">[${type === 'loot' ? 'Nhặt được' : type === 'good' ? 'Thành công' : 'Tiên lộ'}]</span> ${escapeHtml(message)}`;
    logEl.prepend(p);
    while (logEl.children.length > 3) logEl.removeChild(logEl.lastChild);
    lastLogText = message;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
  }

  function addItem(id, amount = 1) {
    state.inventory[id] = (state.inventory[id] || 0) + amount;
    updateHUD(); saveGame();
  }

  function consumeItem(id, amount = 1) {
    if ((state.inventory[id] || 0) < amount) return false;
    state.inventory[id] -= amount;
    if (state.inventory[id] <= 0) delete state.inventory[id];
    updateHUD(); saveGame();
    return true;
  }

  function createCharacter() {
    const inputName = ($('#createName')?.value || draftName || '').trim().slice(0, 14);
    draftName = inputName;
    state.created = true;
    state.name = inputName || (selectedGender === 'female' ? 'Thanh Liên' : 'Vân Trần');
    state.gender = selectedGender;
    state.classId = selectedClass;
    state.level = 1; state.xp = 0; state.hp = Math.round(300 * CLASS().hp); state.hpMax = state.hp;
    state.qi = 20; state.realmIndex = 0; state.realmStep = 1; state.x = 800; state.y = 970;
    state.inventory = { herb: 5, stone: 35, pill: 2, sword: selectedClass === 'sword' ? 1 : 0 };
    if (selectedClass === 'archer') state.inventory.silk = 1;
    state.chapter = 1; state.stones = 35; state.coins = 120; state.questKills = 0; state.questClaimed = false;
    state.totalKills = 0; state.totalCultivations = 0; state.sect = ''; state.auto = false;
    state.weapon = selectedClass === 'archer' ? 'bow' : 'sword';
    state.unlockedSkills = []; state.achievements = [];
    monsters = []; drops = []; spawnMonsters(true);
    modalRoot.hidden = true; modalName = '';
    log(`Đạo hữu ${state.name} đã bước lên con đường tu tiên.`, 'good');
    toast(`Chào mừng ${state.name} đến với Tiên Lộ!`, 2400);
    updateHUD(); saveGame(true);
  }

  function updateHUD() {
    $('#playerName').textContent = state.created ? state.name : 'Đạo hữu mới';
    $('#avatar').textContent = state.gender === 'female' ? '👩🏻‍🎤' : '🧙🏻';
    $('#realmChip').textContent = `${REALMS[state.realmIndex] || 'Đại Đạo'} ${state.realmStep}/9`;
    $('#power').textContent = playerPower().toLocaleString('vi-VN');
    $('#levelText').textContent = `Cấp ${state.level}`;
    const hpPct = Math.max(0, Math.min(100, state.hp / state.hpMax * 100));
    const qiPct = Math.max(0, Math.min(100, state.qi / state.qiMax * 100));
    const xpPct = Math.max(0, Math.min(100, state.xp / xpNeeded() * 100));
    $('#hpBar').style.width = `${hpPct}%`; $('#qiBar').style.width = `${qiPct}%`; $('#xpBar').style.width = `${xpPct}%`;
    $('#hpText').textContent = `${Math.ceil(state.hp)}/${state.hpMax}`;
    $('#qiText').textContent = `${Math.floor(state.qi)}/${state.qiMax}`;
    $('#xpText').textContent = `${Math.floor(xpPct)}%`;
    $('#stoneCount').textContent = state.stones.toLocaleString('vi-VN');
    $('#zoneName').textContent = zone().name;
    $('#autoState').textContent = state.auto ? 'Bật' : 'Tắt';
    $('#autoButton').classList.toggle('active', state.auto);
    $('#skillName').textContent = CLASS().skill.length > 9 ? 'Tuyệt kỹ' : CLASS().skill;
    $('#skillGlyph').textContent = CLASS().glyph;
    if (state.questClaimed) {
      $('#questTitle').textContent = 'Nhiệm vụ tân thủ hoàn thành';
      $('#questDesc').textContent = 'Đến gặp Trưởng thôn để nhận nhiệm vụ mới';
      $('#questProgress').textContent = '✓';
    } else {
      $('#questTitle').textContent = 'Nhiệm vụ 1 • Trừ yêu trong thôn';
      $('#questDesc').textContent = 'Đánh bại 3 yêu thú gần thôn';
      $('#questProgress').textContent = `${Math.min(3, state.questKills)}/3`;
    }
  }

  function addXP(amount) {
    const gain = Math.round(amount * (state.classId === 'mortal' ? 1.1 : 1));
    state.xp += gain;
    while (state.xp >= xpNeeded() && state.level < levelCap) {
      state.xp -= xpNeeded();
      state.level++;
      state.hpMax += 16; state.hp = state.hpMax;
      state.skillPoints++;
      log(`Đột phá cấp độ ${state.level}! Sinh lực và sức mạnh tăng lên.`, 'good');
      toast(`Tăng cấp! Hiện tại cấp ${state.level}`, 1600);
      if (state.level === 10 || state.level === 20) {
        toast(`Đã đủ tư cách tiến vào ${ZONES[state.level === 10 ? 1 : 2].name}!`, 2600);
      }
    }
    if (state.level >= levelCap) state.xp = 0;
    updateHUD(); saveGame();
  }

  function cultivate() {
    if (!state.created) return;
    if (state.hp < state.hpMax * .25) { toast('Sinh lực quá thấp, hãy hồi phục trước khi ngồi thiền.'); return; }
    const gain = 9 + Math.floor(Math.random() * 8) + (state.classId === 'alchemy' ? 3 : 0);
    state.qi = Math.min(state.qiMax, state.qi + gain);
    state.totalCultivations++;
    log(`Ngồi thiền hấp thu ${gain} điểm linh khí.`, 'good');
    updateHUD(); saveGame();
    if (state.qi >= state.qiMax) {
      setTimeout(() => { if (!modalName) openModal('cultivation'); toast('Linh khí đã viên mãn, có thể thử đột phá!'); }, 180);
    } else toast(`Hấp thu +${gain} linh khí`);
  }

  function breakthrough() {
    if (state.qi < state.qiMax) { toast('Linh khí chưa viên mãn.'); return; }
    const cost = 10 + state.realmIndex * 6 + (state.realmStep > 6 ? 8 : 0);
    if (state.stones < cost) { toast(`Cần ${cost} linh thạch để hộ pháp đột phá.`); return; }
    state.stones -= cost;
    state.qi = 18;
    const chance = Math.max(.55, .92 - (state.classId === 'ghost' ? .12 : 0) - (state.realmIndex > 8 ? .12 : 0));
    if (Math.random() <= chance) {
      state.realmStep++;
      if (state.realmStep > 9) { state.realmStep = 1; state.realmIndex = Math.min(REALMS.length - 1, state.realmIndex + 1); }
      state.hpMax += 12 + state.realmIndex * 2; state.hp = state.hpMax;
      state.skillPoints++;
      log(`Đột phá thành công: ${REALMS[state.realmIndex]} ${state.realmStep}!`, 'good');
      toast(`Đột phá thành công • ${REALMS[state.realmIndex]} ${state.realmStep}/9`, 2400);
      addXP(30 + state.realmIndex * 12);
    } else {
      const loss = Math.floor(state.hpMax * (state.classId === 'ghost' ? .22 : .12));
      state.hp = Math.max(1, state.hp - loss);
      log('Đột phá thất bại, kinh mạch bị phản chấn.', 'system');
      toast('Đột phá thất bại! Hãy điều tức rồi thử lại.', 2200);
    }
    updateHUD(); saveGame(true); openModal('cultivation');
  }

  function currentMonsterDef(chapter, id) {
    return (MONSTERS[chapter] || MONSTERS[1]).find(m => m.id === id) || MONSTERS[1][0];
  }

  let monsterIdCounter = 1;
  function spawnMonsters(initial = false) {
    if (!state.created) return;
    if (initial) monsters = [];
    const desired = state.chapter === 1 ? 8 : 7;
    while (monsters.length < desired) {
      const definitions = MONSTERS[state.chapter];
      const def = definitions[Math.floor(Math.random() * definitions.length)];
      const angle = Math.random() * Math.PI * 2;
      const distance = initial ? 180 + Math.random() * 430 : 300 + Math.random() * 440;
      const x = Math.max(100, Math.min(1500, state.x + Math.cos(angle) * distance));
      const y = Math.max(150, Math.min(1500, state.y + Math.sin(angle) * distance));
      const baseScale = state.chapter === 1 ? 1 : state.chapter === 2 ? 1.65 : 2.5;
      const mob = {
        uid: monsterIdCounter++, defId: def.id, chapter: state.chapter,
        x, y, hpMax: Math.round(def.hp * baseScale), hp: Math.round(def.hp * baseScale),
        atk: Math.round(def.atk * baseScale), speed: 22 + Math.random() * 12,
        phase: Math.random() * 10, attackWait: Math.random() * 1.2, hurt: 0,
        poison: 0, level: Math.min(30, def.exp < 50 ? 1 + Math.floor(Math.random() * 8) : state.chapter === 2 ? 10 + Math.floor(Math.random() * 10) : 20 + Math.floor(Math.random() * 10))
      };
      monsters.push(mob);
    }
  }

  function nearestMonster(maxDistance = Infinity) {
    let nearest = null, min = maxDistance;
    for (const mob of monsters) {
      const d = Math.hypot(mob.x - state.x, mob.y - state.y);
      if (d < min) { min = d; nearest = mob; }
    }
    return nearest;
  }

  function mobByUid(uid) { return monsters.find(m => m.uid === uid) || null; }

  function dealDamage(mob, amount, kind = 'normal') {
    if (!mob) return;
    const critical = Math.random() < .1;
    const actual = Math.max(1, Math.round(amount * (critical ? 1.65 : 1)));
    mob.hp -= actual; mob.hurt = .22;
    if (kind === 'poison') mob.poison = 3.5;
    spawnHit(mob.x, mob.y - 16, critical ? '#fff0a1' : kind === 'poison' ? '#b7ff9b' : '#ffbf83', critical ? 'CRIT' : `-${actual}`);
    if (state.classId === 'ghost') state.hp = Math.min(state.hpMax, state.hp + Math.ceil(actual * .12));
    if (mob.hp <= 0) killMonster(mob);
  }

  function attack() {
    if (!state.created || attackCooldown > 0) return;
    let mob = currentTarget && mobByUid(currentTarget.uid) ? currentTarget : null;
    const range = attackRange();
    if (!mob || mob.hp <= 0) mob = nearestMonster(range + 75);
    if (!mob) {
      const far = nearestMonster(430);
      if (far) { currentTarget = far; state.targetId = far.uid; moveTarget = { x: far.x, y: far.y }; toast('Mục tiêu ở xa, đang áp sát...'); }
      else toast('Không có yêu thú trong khu vực.');
      return;
    }
    currentTarget = mob; state.targetId = mob.uid;
    const distance = Math.hypot(mob.x - state.x, mob.y - state.y);
    if (distance > range) { moveTarget = { x: mob.x, y: mob.y }; toast('Đang tiến vào tầm đánh...'); return; }
    attackCooldown = state.classId === 'archer' ? .78 : .62;
    state.facing = mob.x >= state.x ? 1 : -1;
    let dmg = playerAttack() * (state.weapon === 'sword' && state.classId === 'sword' ? 1.08 : 1);
    if (state.classId === 'poison') dmg *= 1.02;
    dealDamage(mob, dmg, state.classId === 'poison' ? 'poison' : 'normal');
    if (navigator.vibrate) navigator.vibrate(12);
  }

  function useSkill() {
    if (!state.created || skillCooldown > 0) { if (skillCooldown > 0) toast(`Kỹ năng hồi chiêu ${skillCooldown.toFixed(1)}s`); return; }
    const cost = state.classId === 'alchemy' ? 18 : 22;
    if (state.qi < cost) { toast(`Cần ${cost} linh khí để thi triển.`); return; }
    state.qi -= cost; skillCooldown = 7.5;
    const radius = state.classId === 'archer' ? 235 : 160;
    let hits = 0;
    const base = playerAttack() * (state.classId === 'sword' ? 2.0 : state.classId === 'archer' ? 1.75 : 1.55);
    for (const mob of [...monsters]) {
      const d = Math.hypot(mob.x - state.x, mob.y - state.y);
      if (d <= radius) {
        let damage = base;
        if (state.classId === 'poison') damage *= 1.15;
        if (state.classId === 'charm') { mob.speed *= .35; mob.hurt = .45; }
        dealDamage(mob, damage, state.classId === 'poison' ? 'poison' : 'skill');
        hits++;
      }
    }
    if (state.classId === 'alchemy') { state.hp = Math.min(state.hpMax, state.hp + 75); }
    if (!hits) {
      const far = nearestMonster(340);
      if (far) { dealDamage(far, base, state.classId === 'poison' ? 'poison' : 'skill'); hits = 1; }
    }
    spawnBurst(state.x, state.y, CLASS().color, 18);
    log(`${CLASS().skill} thi triển, ảnh hưởng ${hits} mục tiêu.`, 'good');
    updateHUD(); saveGame();
  }

  function usePill() {
    if (!consumeItem('pill', 1)) { toast('Đã hết Tụ Khí Đan. Mua tại thương hội nhé.'); return; }
    const heal = Math.round(120 * (state.classId === 'alchemy' ? 1.25 : 1));
    state.hp = Math.min(state.hpMax, state.hp + heal);
    state.qi = Math.min(state.qiMax, state.qi + 35);
    spawnBurst(state.x, state.y, '#91f2b1', 10);
    log(`Dùng Tụ Khí Đan: hồi ${heal} sinh lực và 35 linh khí.`, 'good');
    updateHUD(); saveGame();
  }

  function killMonster(mob) {
    const def = currentMonsterDef(mob.chapter, mob.defId);
    monsters = monsters.filter(m => m.uid !== mob.uid);
    if (currentTarget && currentTarget.uid === mob.uid) currentTarget = null;
    state.totalKills++;
    if (state.chapter === 1 && !state.questClaimed) state.questKills++;
    const coinGain = Math.round(def.coins * (state.chapter === 1 ? 1 : state.chapter === 2 ? 1.5 : 2));
    state.coins += coinGain;
    const xpGain = Math.round(def.exp * (state.chapter === 1 ? 1 : state.chapter === 2 ? 1.1 : 1.2));
    addXP(xpGain);
    drops.push({ x: mob.x, y: mob.y, type: 'coins', amount: coinGain, life: 22, bob: Math.random() * 5 });
    if (Math.random() < .64) drops.push({ x: mob.x + 16, y: mob.y + 9, type: def.drop, amount: 1 + (Math.random() < .18 ? 1 : 0), life: 24, bob: Math.random() * 5 });
    if (Math.random() < .045) drops.push({ x: mob.x - 12, y: mob.y + 18, type: 'pill', amount: 1, life: 24, bob: 0 });
    // Pháp bảo drop rates scale with chapter, player level and remaining vitality.
    const vitalityLuck = .82 + (state.hp / state.hpMax) * .28 + state.level / 120;
    const roll = Math.random();
    let relic = '';
    if (state.chapter === 1 && roll < .025 * vitalityLuck) relic = 'qi_sword';
    if (state.chapter === 2) {
      if (roll < .032 * vitalityLuck) relic = 'qi_sword';
      else if (roll < .040 * vitalityLuck) relic = 'flying_sword';
      else if (roll < .0405 * vitalityLuck) relic = 'ancient_bell';
    }
    if (state.chapter === 3) {
      if (roll < .03 * vitalityLuck) relic = 'qi_sword';
      else if (roll < .044 * vitalityLuck) relic = 'flying_sword';
      else if (roll < .0462 * vitalityLuck) relic = 'ancient_bell';
      else if (roll < .0466 * vitalityLuck) relic = 'heavenly_tower';
      else if (roll < .0467 * vitalityLuck) relic = 'immortal_shard';
      else if (roll < .04671 * vitalityLuck) relic = 'chaos_core';
    }
    if (relic) drops.push({ x: mob.x + 4, y: mob.y - 14, type: relic, amount: 1, life: 28, bob: Math.random() * 5 });
    spawnBurst(mob.x, mob.y, def.accent, 12);
    log(`${def.name} bị đánh bại • +${xpGain} EXP • +${coinGain} đồng.`, 'good');
    if (state.questKills === 3 && !state.questClaimed) toast('Đã hoàn thành nhiệm vụ! Mở bảng nhiệm vụ để nhận thưởng.', 2300);
    updateHUD(); saveGame();
    if (state.totalKills === 10 && !state.achievements.includes('first10')) unlockAchievement('first10');
  }

  function unlockAchievement(id) {
    if (state.achievements.includes(id)) return;
    state.achievements.push(id);
    toast('Mở khóa thành tựu mới!', 2000);
    log('Thành tựu mới: Bách chiến sơ thành.', 'good');
  }

  function takeDamage(amount) {
    const real = Math.max(1, Math.round(amount - playerDefense() * .35));
    state.hp = Math.max(0, state.hp - real);
    spawnHit(state.x, state.y - 25, '#ff7689', `-${real}`);
    if (state.hp <= 0) {
      state.hp = Math.ceil(state.hpMax * .4);
      state.x = 800; state.y = 970; state.auto = false;
      state.coins = Math.max(0, state.coins - Math.floor(state.coins * .08));
      currentTarget = null; moveTarget = null;
      toast('Nguyên thần hộ thể! Bạn được đưa về điểm hồi sinh và mất 8% đồng.', 2600);
      log('Bạn đã trọng thương và được truyền tống về thôn.', 'system');
    }
    updateHUD(); saveGame();
  }

  function updateMonsters(dt) {
    for (const mob of [...monsters]) {
      const def = currentMonsterDef(mob.chapter, mob.defId);
      const d = Math.hypot(state.x - mob.x, state.y - mob.y);
      mob.phase += dt * 3; mob.hurt = Math.max(0, mob.hurt - dt); mob.attackWait -= dt;
      if (mob.poison > 0) {
        mob.poison -= dt;
        if (Math.floor((mob.poison + dt) * 2) !== Math.floor(mob.poison * 2)) {
          mob.hp -= Math.max(1, Math.round(playerAttack() * .07));
          spawnHit(mob.x, mob.y - 14, '#b6f78c', 'ĐỘC');
          if (mob.hp <= 0) { killMonster(mob); continue; }
        }
      }
      if (d < 260) {
        if (d > 32) {
          const speed = mob.speed * (state.auto && currentTarget && currentTarget.uid === mob.uid ? .6 : 1);
          mob.x += (state.x - mob.x) / d * speed * dt;
          mob.y += (state.y - mob.y) / d * speed * dt;
        } else if (mob.attackWait <= 0) {
          mob.attackWait = 1.15 + Math.random() * .45;
          takeDamage(mob.atk);
        }
      } else {
        mob.x += Math.sin(mob.phase) * 4 * dt;
        mob.y += Math.cos(mob.phase * .8) * 3 * dt;
      }
    }
  }

  function updateDrops(dt) {
    for (const drop of [...drops]) {
      drop.life -= dt;
      if (drop.life <= 0) { drops = drops.filter(d => d !== drop); continue; }
      const d = Math.hypot(state.x - drop.x, state.y - drop.y);
      if (d < 48) {
        if (drop.type === 'coins') { state.coins += drop.amount; log(`Nhặt ${drop.amount} đồng.`, 'loot'); }
        else { addItem(drop.type, drop.amount); log(`${ITEMS[drop.type]?.name || drop.type} ×${drop.amount}`, 'loot'); }
        drops = drops.filter(d2 => d2 !== drop);
        continue;
      }
      if (state.auto && d < 220) { drop.x += (state.x - drop.x) / d * 75 * dt; drop.y += (state.y - drop.y) / d * 75 * dt; }
    }
  }

  function update(dt) {
    elapsed += dt; dayPhase += dt * .015;
    attackCooldown = Math.max(0, attackCooldown - dt);
    skillCooldown = Math.max(0, skillCooldown - dt);
    targetFlash = Math.max(0, targetFlash - dt);
    let dx = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    let dy = (input.down ? 1 : 0) - (input.up ? 1 : 0);
    if (dx || dy) moveTarget = null;
    if (state.auto && !dx && !dy) {
      let autoMob = currentTarget && mobByUid(currentTarget.uid);
      if (!autoMob || autoMob.hp <= 0 || Math.hypot(autoMob.x - state.x, autoMob.y - state.y) > 520) {
        autoMob = nearestMonster(520); currentTarget = autoMob;
      }
      if (autoMob) {
        const d = Math.hypot(autoMob.x - state.x, autoMob.y - state.y);
        if (d > attackRange() * .82) { dx = (autoMob.x - state.x) / d; dy = (autoMob.y - state.y) / d; }
        else attack();
      }
    }
    if (moveTarget && !dx && !dy) {
      const d = Math.hypot(moveTarget.x - state.x, moveTarget.y - state.y);
      if (d > 13) { dx = (moveTarget.x - state.x) / d; dy = (moveTarget.y - state.y) / d; }
      else moveTarget = null;
    }
    if (dx || dy) {
      const len = Math.hypot(dx, dy) || 1; dx /= len; dy /= len;
      const speed = 155;
      state.x = Math.max(85, Math.min(1515, state.x + dx * speed * dt));
      state.y = Math.max(120, Math.min(1515, state.y + dy * speed * dt));
      if (dx) state.facing = dx > 0 ? 1 : -1;
    }
    regenTimer += dt;
    if (regenTimer > 3) {
      regenTimer = 0;
      if (state.hp < state.hpMax && !monsters.some(m => Math.hypot(m.x - state.x, m.y - state.y) < 65)) state.hp = Math.min(state.hpMax, state.hp + 2);
      if (state.qi < state.qiMax) state.qi = Math.min(state.qiMax, state.qi + .5);
      updateHUD();
    }
    updateMonsters(dt); updateDrops(dt); updateParticles(dt);
    spawnTimer += dt;
    if (spawnTimer > 5) { spawnTimer = 0; spawnMonsters(false); }
    if (Math.random() < .02 && particles.length < 35 && state.settings.particles) {
      particles.push({ x: camera.x + Math.random() * screenW, y: camera.y + Math.random() * screenH, vx: (Math.random() - .5) * 9, vy: -8 - Math.random() * 14, life: 2 + Math.random() * 2, color: state.chapter === 2 ? '#dcf6ff' : state.chapter === 3 ? '#ffbd79' : '#e2eab1', size: Math.random() < .2 ? 3 : 2 });
    }
    updateCamera(dt); updateMiniMap();
    if (elapsed % 8 < dt) saveGame();
  }

  function updateCamera(dt) {
    const targetX = state.x - screenW / 2;
    const targetY = state.y - screenH / 2;
    camera.x += (targetX - camera.x) * Math.min(1, dt * 4.5);
    camera.y += (targetY - camera.y) * Math.min(1, dt * 4.5);
    camera.x = Math.max(0, Math.min(1600 - screenW, camera.x));
    camera.y = Math.max(0, Math.min(1600 - screenH, camera.y));
  }

  function updateParticles(dt) {
    for (const p of [...particles]) {
      p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
      if (p.life <= 0) particles = particles.filter(x => x !== p);
    }
  }

  function resize() {
    const rect = $('#app').getBoundingClientRect();
    screenW = rect.width; screenH = rect.height;
    const ratio = window.devicePixelRatio || 1;
    dpr = state.settings.quality === 'low' ? Math.min(1, ratio) : state.settings.quality === 'medium' ? Math.min(1.5, ratio) : Math.min(2, ratio);
    canvas.width = Math.floor(screenW * dpr); canvas.height = Math.floor(screenH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.imageSmoothingEnabled = false;
    updateCamera(1); draw();
  }

  function hash(x, y) {
    const n = Math.sin(x * 127.1 + y * 311.7 + state.chapter * 71.3) * 43758.5453;
    return n - Math.floor(n);
  }

  function worldColor() {
    return state.chapter === 1 ? ['#254b35', '#28513a', '#2d573d', '#21472f'] : state.chapter === 2 ? ['#38586a', '#416477', '#4c7081', '#344f62'] : ['#5a3429', '#653b2a', '#70412a', '#513126'];
  }

  function drawGround() {
    const tile = 32;
    const colors = worldColor();
    ctx.fillStyle = colors[0]; ctx.fillRect(0, 0, screenW, screenH);
    const startX = Math.floor(camera.x / tile) - 1, endX = Math.ceil((camera.x + screenW) / tile) + 1;
    const startY = Math.floor(camera.y / tile) - 1, endY = Math.ceil((camera.y + screenH) / tile) + 1;
    for (let ty = startY; ty <= endY; ty++) {
      for (let tx = startX; tx <= endX; tx++) {
        const wx = tx * tile, wy = ty * tile;
        const sx = Math.floor(wx - camera.x), sy = Math.floor(wy - camera.y);
        const h = hash(tx, ty);
        ctx.fillStyle = colors[Math.floor(h * colors.length)]; ctx.fillRect(sx, sy, tile + 1, tile + 1);
        if (h > .47) {
          ctx.fillStyle = state.chapter === 2 ? '#9abac4' : state.chapter === 3 ? '#9a5939' : '#416746';
          ctx.fillRect(sx + 6 + Math.floor(h * 12), sy + 7 + Math.floor(h * 8), 2, 2);
          ctx.fillRect(sx + 22, sy + 19, 2, 2);
        }
        if (h > .92) {
          ctx.fillStyle = state.chapter === 2 ? '#e4f5fa' : state.chapter === 3 ? '#ffb35a' : '#e4b6d1';
          ctx.fillRect(sx + 13, sy + 23, 3, 3);
        }
      }
    }
    // dirt trail and shrine clearing
    if (state.chapter === 1) {
      drawRoad(770, 150, 64, 1310, '#80664d'); drawRoad(160, 760, 1290, 54, '#81674e');
      drawClearing(800, 770, 230, 190);
    } else if (state.chapter === 2) {
      drawRoad(785, 100, 48, 1390, '#79909a'); drawClearing(800, 780, 240, 170);
      drawIcePatch(290, 370, 120, 70); drawIcePatch(1260, 1120, 170, 90);
    } else {
      drawRoad(780, 100, 52, 1400, '#9b6240'); drawClearing(800, 780, 250, 190);
      drawLava(320, 320, 120, 55); drawLava(1260, 1120, 150, 70);
    }
    // natural map border
    ctx.fillStyle = state.chapter === 2 ? '#233746' : state.chapter === 3 ? '#301e22' : '#172a29';
    ctx.fillRect(0, 0, 1600, 18); ctx.fillRect(0, 0, 18, 1600); ctx.fillRect(1582, 0, 18, 1600); ctx.fillRect(0, 1582, 1600, 18);
  }

  function drawRoad(x, y, w, h, color) {
    const sx = x - camera.x, sy = y - camera.y;
    ctx.fillStyle = color; ctx.fillRect(sx, sy, w, h);
    ctx.fillStyle = 'rgba(31,24,25,.22)';
    for (let i = 0; i < w; i += 35) ctx.fillRect(sx + i, sy + (i % 3) * 5, 7, 5);
    for (let i = 0; i < h; i += 42) ctx.fillRect(sx + (i % 4) * 4, sy + i, 6, 4);
    ctx.fillStyle = 'rgba(255,230,177,.12)'; ctx.fillRect(sx + 5, sy + 5, Math.max(1, w - 10), 3);
  }

  function drawClearing(cx, cy, w, h) {
    const sx = cx - camera.x, sy = cy - camera.y;
    ctx.fillStyle = state.chapter === 2 ? '#607a82' : state.chapter === 3 ? '#7b4b36' : '#58694b';
    ctx.fillRect(sx - w / 2, sy - h / 2, w, h);
    ctx.fillStyle = state.chapter === 2 ? '#8298a0' : state.chapter === 3 ? '#aa6a43' : '#8d9671';
    ctx.fillRect(sx - w / 2 + 8, sy - h / 2 + 8, w - 16, h - 16);
    ctx.fillStyle = 'rgba(12,19,19,.22)';
    for (let i = 0; i < 22; i++) ctx.fillRect(sx - w / 2 + (i * 29) % w, sy - h / 2 + (i * 41) % h, 6, 4);
    // circular cultivation dais
    drawStoneDais(sx, sy + 10, 70);
  }

  function drawStoneDais(x, y, r) {
    ctx.fillStyle = '#303640'; ctx.beginPath(); ctx.ellipse(x, y + 19, r + 9, r * .63, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#9aa5a9'; ctx.beginPath(); ctx.ellipse(x, y + 12, r + 5, r * .62, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#d2d5c9'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(x, y + 10, r - 4, r * .5, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = '#55d9dd'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y + 10, r * .65, r * .34, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#8bf8ec'; ctx.fillRect(x - 2, y - 5, 4, 28);
    ctx.fillStyle = '#d6f9ed'; ctx.fillRect(x - 1, y + 5, 2, 8);
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4;
      ctx.fillStyle = '#667b83'; ctx.fillRect(x + Math.cos(a) * (r + 1) - 4, y + 10 + Math.sin(a) * r * .45 - 4, 8, 8);
    }
  }

  function drawIcePatch(x, y, w, h) {
    ctx.fillStyle = '#86c4dc'; ctx.fillRect(x - camera.x, y - camera.y, w, h);
    ctx.fillStyle = '#c6f4ff'; ctx.fillRect(x - camera.x + 12, y - camera.y + 8, w * .45, 4);
    ctx.fillStyle = '#4d8fab'; ctx.fillRect(x - camera.x + w * .6, y - camera.y + h * .45, w * .28, 4);
  }

  function drawLava(x, y, w, h) {
    ctx.fillStyle = '#301b20'; ctx.fillRect(x - camera.x - 4, y - camera.y - 4, w + 8, h + 8);
    ctx.fillStyle = '#e65b2e'; ctx.fillRect(x - camera.x, y - camera.y, w, h);
    ctx.fillStyle = '#ffb344'; ctx.fillRect(x - camera.x + 13, y - camera.y + 10, w * .38, 6);
    ctx.fillStyle = '#ffda73'; ctx.fillRect(x - camera.x + w * .62, y - camera.y + h * .56, 24, 5);
  }

  function drawTree(x, y, variant = 0, scale = 1) {
    const sx = x - camera.x, sy = y - camera.y;
    if (sx < -100 || sy < -120 || sx > screenW + 100 || sy > screenH + 100) return;
    const trunk = state.chapter === 2 ? '#526f7b' : state.chapter === 3 ? '#663b2d' : '#624333';
    const crown = state.chapter === 2 ? ['#7db4cc', '#a4d3df', '#4d819d'][variant % 3] : state.chapter === 3 ? ['#ce5935', '#e58a3e', '#9c382f'][variant % 3] : ['#e2a94c', '#d85b43', '#3d7652', '#d982b7'][variant % 4];
    ctx.fillStyle = 'rgba(0,0,0,.24)'; ctx.fillRect(sx - 20 * scale, sy + 2 * scale, 42 * scale, 10 * scale);
    ctx.fillStyle = trunk; ctx.fillRect(sx - 5 * scale, sy - 15 * scale, 10 * scale, 31 * scale);
    ctx.fillStyle = '#271f23'; ctx.fillRect(sx - 4 * scale, sy + 7 * scale, 4 * scale, 9 * scale);
    ctx.fillStyle = crown; ctx.fillRect(sx - 22 * scale, sy - 52 * scale, 44 * scale, 30 * scale);
    ctx.fillRect(sx - 14 * scale, sy - 67 * scale, 30 * scale, 25 * scale);
    ctx.fillRect(sx - 31 * scale, sy - 43 * scale, 20 * scale, 18 * scale);
    ctx.fillRect(sx + 10 * scale, sy - 42 * scale, 22 * scale, 18 * scale);
    ctx.fillStyle = 'rgba(255,239,185,.35)'; ctx.fillRect(sx - 12 * scale, sy - 60 * scale, 13 * scale, 5 * scale);
    ctx.fillStyle = 'rgba(18,34,31,.2)'; ctx.fillRect(sx - 18 * scale, sy - 30 * scale, 30 * scale, 5 * scale);
    if (scale > 1) { ctx.fillStyle = '#2e5b47'; ctx.fillRect(sx + 9 * scale, sy - 17 * scale, 8 * scale, 10 * scale); }
  }

  function drawBush(x, y, variant = 0) {
    const sx = x - camera.x, sy = y - camera.y;
    if (sx < -60 || sy < -60 || sx > screenW + 60 || sy > screenH + 60) return;
    const colors = state.chapter === 2 ? ['#679aae', '#a2d7e5'] : state.chapter === 3 ? ['#a84632', '#ed9a3b'] : [['#ad4d6c', '#eb8aa4'], ['#d3a238', '#f3d56d'], ['#477c55', '#87bd73']][variant % 3];
    ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.fillRect(sx - 15, sy + 4, 32, 6);
    ctx.fillStyle = colors[0]; ctx.fillRect(sx - 14, sy - 10, 28, 15); ctx.fillRect(sx - 7, sy - 16, 17, 12);
    ctx.fillStyle = colors[1]; ctx.fillRect(sx - 8, sy - 12, 8, 5); ctx.fillRect(sx + 4, sy - 7, 6, 5);
  }

  function drawVillageObjects() {
    const isHome = state.chapter === 1;
    const props = isHome ? [
      [360, 540, 'tree', 3, 1.5], [1210, 570, 'tree', 0, 1.7], [430, 1080, 'tree', 1, 1.55],
      [1120, 1120, 'tree', 2, 1.55], [250, 900, 'tree', 0, 1.35], [1360, 850, 'tree', 1, 1.5],
      [590, 390, 'bush', 0], [1060, 420, 'bush', 1], [340, 760, 'bush', 2], [1270, 760, 'bush', 1],
      [490, 1260, 'bush', 0], [1180, 1320, 'bush', 2], [620, 650, 'bush', 1], [980, 650, 'bush', 0]
    ] : state.chapter === 2 ? [
      [350, 480, 'tree', 0, 1.4], [1230, 540, 'tree', 1, 1.5], [430, 1100, 'tree', 2, 1.45], [1150, 1160, 'tree', 0, 1.5],
      [600, 400, 'bush', 0], [1040, 460, 'bush', 1], [360, 900, 'bush', 2], [1280, 900, 'bush', 1]
    ] : [
      [350, 470, 'tree', 0, 1.5], [1240, 560, 'tree', 1, 1.55], [430, 1120, 'tree', 2, 1.4], [1160, 1180, 'tree', 0, 1.55],
      [610, 420, 'bush', 0], [1040, 460, 'bush', 1], [370, 920, 'bush', 2], [1280, 910, 'bush', 1]
    ];
    for (const p of props) { if (p[2] === 'tree') drawTree(p[0], p[1], p[3], p[4]); else drawBush(p[0], p[1], p[3]); }
    if (state.chapter === 1) {
      drawShrine(800, 690);
      drawHouse(530, 650); drawHouse(1080, 680);
      drawNPC(790, 625, 'Trưởng thôn', 'elder');
      drawNPC(930, 755, 'Đan sư', 'alchemist');
      drawNPC(650, 790, 'Luyện khí sư', 'smith');
    } else {
      drawShrine(800, 690);
      drawNPC(800, 620, state.chapter === 2 ? 'Băng Cốc trưởng lão' : 'Hỏa Vân trưởng lão', 'elder');
      drawHouse(570, 700); drawHouse(1040, 720);
    }
    // rocks and small ground detail
    drawRock(255, 1180); drawRock(1320, 1240); drawRock(1370, 420);
  }

  function drawHouse(x, y) {
    const sx = x - camera.x, sy = y - camera.y;
    if (sx < -150 || sy < -150 || sx > screenW + 150 || sy > screenH + 150) return;
    ctx.fillStyle = '#302b35'; ctx.fillRect(sx - 52, sy - 33, 108, 50);
    ctx.fillStyle = state.chapter === 2 ? '#9bb9c4' : state.chapter === 3 ? '#874737' : '#9c9581';
    ctx.fillRect(sx - 48, sy - 48, 96, 42);
    ctx.fillStyle = state.chapter === 2 ? '#395b71' : state.chapter === 3 ? '#542d2b' : '#75423a';
    ctx.fillRect(sx - 59, sy - 63, 119, 22); ctx.fillRect(sx - 38, sy - 72, 77, 14);
    ctx.fillStyle = '#4c3041'; ctx.fillRect(sx - 11, sy - 5, 22, 22);
    ctx.fillStyle = '#e2bf7b'; ctx.fillRect(sx - 7, sy - 2, 14, 19);
    ctx.fillStyle = 'rgba(255,236,174,.35)'; ctx.fillRect(sx - 45, sy - 45, 17, 4);
  }

  function drawShrine(x, y) {
    const sx = x - camera.x, sy = y - camera.y;
    if (sx < -150 || sy < -130 || sx > screenW + 150 || sy > screenH + 130) return;
    ctx.fillStyle = '#29313a'; ctx.fillRect(sx - 102, sy - 38, 204, 96);
    ctx.fillStyle = '#8e969b'; ctx.fillRect(sx - 96, sy - 48, 192, 90);
    ctx.fillStyle = '#c2c9c7'; ctx.fillRect(sx - 87, sy - 39, 174, 72);
    ctx.fillStyle = '#747d8a';
    for (let i = 0; i < 7; i++) { ctx.fillRect(sx - 88 + i * 27, sy - 47, 15, 5); ctx.fillRect(sx - 88 + i * 27, sy + 34, 15, 5); }
    ctx.fillStyle = '#526178'; ctx.fillRect(sx - 40, sy - 25, 80, 42);
    ctx.fillStyle = '#a9c2cc'; ctx.fillRect(sx - 34, sy - 20, 68, 31);
    ctx.fillStyle = '#465a70'; ctx.fillRect(sx - 4, sy - 19, 8, 30);
    ctx.fillStyle = '#e4f7ed'; ctx.fillRect(sx - 1, sy - 13, 2, 17);
    ctx.fillStyle = '#dfe5dd'; ctx.fillRect(sx - 97, sy + 24, 194, 4);
  }

  function drawRock(x, y) {
    const sx = x - camera.x, sy = y - camera.y;
    if (sx < -50 || sy < -50 || sx > screenW + 50 || sy > screenH + 50) return;
    ctx.fillStyle = '#29313b'; ctx.fillRect(sx - 23, sy - 8, 45, 23);
    ctx.fillStyle = state.chapter === 2 ? '#8098a7' : state.chapter === 3 ? '#69504a' : '#68736d';
    ctx.fillRect(sx - 18, sy - 18, 27, 22); ctx.fillRect(sx - 5, sy - 24, 24, 24);
    ctx.fillStyle = '#b4c0b4'; ctx.fillRect(sx - 12, sy - 16, 8, 4);
  }

  function drawNPC(x, y, name, type) {
    const sx = Math.floor(x - camera.x), sy = Math.floor(y - camera.y);
    if (sx < -50 || sy < -80 || sx > screenW + 50 || sy > screenH + 50) return;
    ctx.fillStyle = '#0007'; ctx.fillRect(sx - 12, sy + 5, 25, 6);
    const robe = type === 'elder' ? '#b89b65' : type === 'alchemist' ? '#4c9b78' : '#6479b7';
    ctx.fillStyle = '#30273e'; ctx.fillRect(sx - 8, sy - 22, 17, 24);
    ctx.fillStyle = robe; ctx.fillRect(sx - 10, sy - 24, 20, 20);
    ctx.fillStyle = '#e8c89f'; ctx.fillRect(sx - 7, sy - 37, 14, 14);
    ctx.fillStyle = type === 'elder' ? '#e6dfc3' : '#34283c'; ctx.fillRect(sx - 8, sy - 41, 16, 7);
    ctx.fillStyle = '#42313c'; ctx.fillRect(sx - 5, sy - 31, 2, 2); ctx.fillRect(sx + 3, sy - 31, 2, 2);
    ctx.fillStyle = '#fff2c9'; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(name, sx, sy - 47);
    if (Math.hypot(state.x - x, state.y - y) < 115) {
      ctx.fillStyle = '#ffdb7e'; ctx.fillRect(sx - 2, sy - 57, 4, 4);
    }
  }

  function drawPlayer() {
    const sx = Math.floor(state.x - camera.x), sy = Math.floor(state.y - camera.y);
    const bob = (input.up || input.down || input.left || input.right || moveTarget || state.auto) ? Math.sin(elapsed * 13) * 2 : Math.sin(elapsed * 3) * 1;
    const colors = { sword: '#d5e3f2', mortal: '#c5a77c', ghost: '#9c70b9', poison: '#75ad68', alchemy: '#dba35d', archer: '#5c9f91', charm: '#d47caa' };
    const robe = colors[state.classId] || '#c6c6d9';
    ctx.fillStyle = '#0008'; ctx.fillRect(sx - 12, sy + 8, 26, 7);
    // feet and robe, stepped pixel shading for a tiny 2.5D model
    ctx.fillStyle = '#30283e'; ctx.fillRect(sx - 8, sy - 7 + bob, 7, 17); ctx.fillRect(sx + 2, sy - 7 + bob, 7, 17);
    ctx.fillStyle = robe; ctx.fillRect(sx - 11, sy - 23 + bob, 22, 23);
    ctx.fillStyle = 'rgba(255,255,255,.28)'; ctx.fillRect(sx - 9, sy - 21 + bob, 5, 15);
    ctx.fillStyle = 'rgba(18,17,37,.32)'; ctx.fillRect(sx + 6, sy - 20 + bob, 4, 17);
    ctx.fillStyle = '#efd3b8'; ctx.fillRect(sx - 7, sy - 39 + bob, 14, 15);
    ctx.fillStyle = state.gender === 'female' ? '#ddd8e7' : '#d5d8e6';
    ctx.fillRect(sx - 9, sy - 44 + bob, 18, 9); ctx.fillRect(sx - 12, sy - 38 + bob, 5, 11); ctx.fillRect(sx + 7, sy - 38 + bob, 5, 11);
    ctx.fillStyle = '#332b43'; ctx.fillRect(sx - 4, sy - 32 + bob, 2, 2); ctx.fillRect(sx + 3, sy - 32 + bob, 2, 2);
    ctx.fillStyle = '#f6e5c2'; ctx.fillRect(sx + (state.facing > 0 ? 8 : -12), sy - 18 + bob, 4, 8);
    if (state.classId === 'sword' || state.classId === 'ghost') {
      ctx.fillStyle = '#c6d4e6'; ctx.fillRect(sx + state.facing * 13, sy - 30 + bob, 3, 29);
      ctx.fillStyle = '#f4d88b'; ctx.fillRect(sx + state.facing * 11, sy - 14 + bob, 7, 3);
    } else if (state.classId === 'archer') {
      ctx.strokeStyle = '#d7bd79'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(sx + state.facing * 12, sy - 15 + bob, 10, -1.1, 1.1); ctx.stroke();
    }
    ctx.fillStyle = '#fff0bf'; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(state.name, sx, sy - 52 + bob);
    if (state.auto) { ctx.fillStyle = '#92eecb'; ctx.fillRect(sx - 2, sy - 60 + bob, 4, 4); }
  }

  function drawMonster(mob) {
    const def = currentMonsterDef(mob.chapter, mob.defId);
    const x = Math.floor(mob.x - camera.x), y = Math.floor(mob.y - camera.y + Math.sin(mob.phase) * 1.5);
    if (x < -75 || y < -85 || x > screenW + 75 || y > screenH + 75) return;
    const hurt = mob.hurt > 0;
    const c = hurt ? '#fff0cd' : def.color;
    ctx.fillStyle = '#0008'; ctx.fillRect(x - 15, y + 6, 31, 7);
    const rect = (rx, ry, rw, rh, color) => { ctx.fillStyle = color; ctx.fillRect(x + rx, y + ry, rw, rh); };
    switch (def.shape) {
      case 'sprout':
        rect(-10, -15, 21, 20, c); rect(-5, -23, 11, 10, def.accent); rect(-3, -31, 5, 10, '#62b86e'); rect(-13, -4, 8, 8, c); rect(7, -4, 8, 8, c); rect(-6, -9, 3, 3, '#26333a'); rect(4, -9, 3, 3, '#26333a'); break;
      case 'wolf': case 'fox':
        rect(-16, -13, 30, 18, c); rect(-7, -24, 18, 15, c); rect(3, -31, 7, 10, def.accent); rect(-7, -29, 6, 8, c); rect(-18, -6, 5, 12, def.accent); rect(-10, 2, 6, 8, '#3b3440'); rect(8, 2, 6, 8, '#3b3440'); rect(9, -17, 3, 3, '#1c1c27'); rect(-20, -18, 10, 5, def.accent); break;
      case 'frog':
        rect(-16, -14, 32, 19, c); rect(-11, -23, 9, 11, def.accent); rect(5, -23, 9, 11, def.accent); rect(-8, -9, 4, 4, '#182a31'); rect(7, -9, 4, 4, '#182a31'); rect(-20, -1, 9, 8, c); rect(11, -1, 9, 8, c); break;
      case 'snake':
        rect(-20, -10, 38, 13, c); rect(7, -18, 14, 12, c); rect(15, -15, 3, 3, '#182631'); rect(-22, -6, 8, 8, def.accent); rect(-9, -13, 5, 3, def.accent); break;
      case 'rhino': case 'bear':
        rect(-17, -22, 34, 26, c); rect(-10, -32, 22, 16, c); rect(-14, -37, 8, 8, def.accent); rect(7, -37, 8, 8, def.accent); rect(-14, 1, 9, 10, '#34323c'); rect(6, 1, 9, 10, '#34323c'); rect(10, -25, 10, 5, def.accent); rect(-3, -25, 3, 3, '#18242b'); break;
      case 'spider':
        rect(-11, -18, 23, 20, c); rect(-7, -25, 15, 10, def.accent);
        for (let i = 0; i < 4; i++) { rect(-22, -17 + i * 5, 12, 3, c); rect(10, -17 + i * 5, 12, 3, c); }
        rect(-7, -22, 3, 3, '#1e202d'); rect(5, -22, 3, 3, '#1e202d'); break;
      case 'bird':
        rect(-12, -15, 25, 19, c); rect(-4, -26, 13, 13, c); rect(-23, -12, 15, 8, def.accent); rect(8, -11, 15, 7, def.accent); rect(7, -19, 10, 4, '#f4c266'); rect(-8, 2, 5, 8, '#443341'); rect(5, 2, 5, 8, '#443341'); break;
      case 'croc':
        rect(-22, -13, 40, 18, c); rect(12, -19, 16, 14, c); rect(20, -10, 13, 5, def.accent); rect(-18, -6, 4, 8, '#34424a'); rect(-7, -6, 4, 8, '#34424a'); rect(22, -18, 3, 3, '#17202a'); break;
      case 'golem':
        rect(-19, -26, 38, 32, c); rect(-13, -37, 27, 15, def.accent); rect(-24, -17, 8, 19, c); rect(16, -17, 8, 19, c); rect(-13, 3, 11, 10, '#382b2d'); rect(5, 3, 11, 10, '#382b2d'); rect(-7, -18, 5, 5, '#ffda78'); rect(5, -18, 5, 5, '#ffda78'); break;
      case 'dragon':
        rect(-18, -19, 37, 24, c); rect(4, -32, 22, 17, c); rect(18, -25, 10, 5, def.accent); rect(-22, -18, 13, 12, def.accent); rect(-11, -34, 10, 9, def.accent); rect(4, 1, 8, 11, '#39262d'); rect(12, -36, 6, 7, '#ffda7a'); break;
      case 'stonefang':
        // Hound armored with individual stone plates and a split crystal mane.
        rect(-17, -13, 31, 18, c); rect(-7, -27, 20, 16, c); rect(-13, -31, 8, 9, def.accent); rect(5, -34, 8, 11, def.accent);
        rect(-14, -20, 8, 7, '#c0c8c1'); rect(-3, -23, 8, 7, '#aeb9b8'); rect(7, -18, 8, 7, '#c7d0ca');
        rect(9, -16, 3, 3, '#1a2631'); rect(-10, 2, 7, 8, '#3d4143'); rect(7, 2, 7, 8, '#3d4143'); rect(-24, -10, 8, 4, def.accent); break;
      case 'cliffrhino':
        // Low, broad rhino with a long mineral horn and a boulder back.
        rect(-20, -17, 39, 23, c); rect(-10, -29, 25, 17, c); rect(10, -30, 18, 5, def.accent); rect(24, -33, 8, 4, '#e7d7a9');
        rect(-15, -24, 10, 8, '#b9b7a1'); rect(0, -28, 9, 9, '#c9c2a9'); rect(-17, 3, 9, 8, '#3a3838'); rect(7, 3, 10, 8, '#3a3838'); break;
      case 'snowwolf':
        // Slender snow wolf with ice antlers and a trailing frost tail.
        rect(-16, -12, 29, 15, c); rect(-7, -25, 18, 14, c); rect(-9, -35, 5, 12, def.accent); rect(5, -36, 5, 13, def.accent);
        rect(10, -20, 12, 6, '#e6fbff'); rect(-23, -9, 10, 5, '#d8f4ff'); rect(-10, 2, 6, 9, '#3c5061'); rect(7, 2, 6, 9, '#3c5061');
        rect(7, -18, 3, 3, '#172b3b'); rect(-5, -5, 17, 3, '#e1f8ff'); break;
      case 'iceelephant':
        // Heavy ice mammoth with a trunk, tusks and frozen back ridge.
        rect(-19, -20, 38, 28, c); rect(-13, -34, 25, 17, c); rect(-18, -31, 9, 13, def.accent); rect(9, -31, 9, 13, def.accent);
        rect(7, -18, 8, 20, '#5b9fc1'); rect(11, -2, 6, 7, '#e3fbff'); rect(-11, -18, 6, 8, '#e9fdff'); rect(7, -18, 6, 8, '#e9fdff');
        rect(-14, 5, 9, 10, '#38566b'); rect(7, 5, 9, 10, '#38566b'); rect(-6, -39, 8, 8, '#d9f8ff'); break;
      case 'emberfox':
        // Fire fox with a split, flame-shaped tail.
        rect(-14, -12, 27, 16, c); rect(-7, -26, 18, 15, c); rect(-9, -33, 7, 10, def.accent); rect(5, -33, 7, 10, def.accent);
        rect(10, -4, 15, 5, '#ffb34e'); rect(20, -13, 8, 10, '#ffdf78'); rect(25, -22, 5, 12, '#e85b2c');
        rect(-10, 2, 6, 8, '#462d31'); rect(7, 2, 6, 8, '#462d31'); rect(6, -19, 3, 3, '#1e2028'); break;
      case 'firebird':
        // Phoenix-like bird with a crest and two separated flame wings.
        rect(-8, -17, 19, 19, c); rect(-3, -28, 14, 13, def.accent); rect(-18, -21, 12, 10, '#ffb04b'); rect(10, -22, 17, 10, '#ffb04b');
        rect(7, -18, 13, 4, '#fff0a1'); rect(-4, -35, 5, 10, '#ffdc76'); rect(2, -38, 5, 11, '#e75d32');
        rect(-4, 1, 4, 9, '#49313a'); rect(6, 1, 4, 9, '#49313a'); break;
      case 'flamewidow':
        // Eight-legged volcanic spider with glowing ember abdomen.
        rect(-10, -18, 22, 22, c); rect(-5, -25, 12, 10, def.accent); rect(-5, -12, 12, 8, '#ffcc64');
        for(let i=0;i<4;i++){rect(-25,-19+i*5,15,3,'#e8783d');rect(10,-19+i*5,15,3,'#e8783d');}
        rect(-5,-23,3,3,'#381b25');rect(5,-23,3,3,'#381b25');rect(-2,-7,4,4,'#fff0a1');break;
      case 'emberrhino':
        // Armored magma charger with a pair of horns and glowing seams.
        rect(-20,-18,40,25,c);rect(-13,-31,27,17,c);rect(-20,-29,10,8,def.accent);rect(10,-29,10,8,def.accent);
        rect(-3,-36,5,13,'#ffdf82');rect(8,-35,5,12,'#ffdf82');rect(-12,-12,6,4,'#ffbe55');rect(5,-12,7,4,'#ffbe55');
        rect(-15,4,10,9,'#42272c');rect(8,4,10,9,'#42272c');rect(19,-8,9,6,'#f5a14a');break;
      default:
        rect(-12, -20, 24, 25, c); rect(-8, -29, 16, 10, def.accent); rect(-4, -12, 3, 3, '#17202a'); rect(5, -12, 3, 3, '#17202a');
    }
    if (currentTarget && currentTarget.uid === mob.uid) {
      ctx.strokeStyle = '#ffe59a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y + 5, 23, 8, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#201425'; ctx.fillRect(x - 23, y - 48, 46, 6);
      ctx.fillStyle = '#ed646c'; ctx.fillRect(x - 22, y - 47, 44 * Math.max(0, mob.hp / mob.hpMax), 4);
      ctx.fillStyle = '#fff2bf'; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(def.name, x, y - 54);
    }
  }

  function drawDrop(drop) {
    const x = Math.floor(drop.x - camera.x), y = Math.floor(drop.y - camera.y + Math.sin(elapsed * 5 + drop.bob) * 3);
    if (x < -30 || y < -30 || x > screenW + 30 || y > screenH + 30) return;
    const icon = drop.type === 'coins' ? '✦' : ITEMS[drop.type]?.icon || '✧';
    ctx.fillStyle = '#0008'; ctx.fillRect(x - 7, y + 5, 16, 4);
    ctx.fillStyle = drop.type === 'coins' ? '#ffe58f' : '#f7dfaa'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(icon, x, y + 2);
  }

  function drawParticles() {
    for (const p of particles) {
      const x = p.x - camera.x, y = p.y - camera.y;
      if (x < -10 || y < -10 || x > screenW + 10 || y > screenH + 10) continue;
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 2)); ctx.fillStyle = p.color; ctx.fillRect(Math.floor(x), Math.floor(y), p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }

  function drawHitLabels() {
    // Hit labels are managed as short-lived screen-space particles.
  }

  function draw() {
    if (!screenW || !screenH) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.imageSmoothingEnabled = false;
    drawGround();
    drawVillageObjects();
    const actors = monsters.map(m => ({ type: 'mob', y: m.y, obj: m })).concat([{ type: 'player', y: state.y, obj: state }]).sort((a,b) => a.y - b.y);
    for (const actor of actors) { if (actor.type === 'mob') drawMonster(actor.obj); else drawPlayer(); }
    for (const drop of drops) drawDrop(drop);
    drawParticles();
    const tint = .08 + Math.max(0, Math.sin(dayPhase)) * .07;
    if (state.chapter === 1) { ctx.fillStyle = `rgba(13,20,43,${tint})`; ctx.fillRect(0,0,screenW,screenH); }
  }

  function spawnHit(x, y, color, text) {
    particles.push({ x, y, vx: (Math.random() - .5) * 13, vy: -28, life: .75, color, size: 2, label: text });
    const p = particles[particles.length - 1]; p.label = text;
  }

  function spawnBurst(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2, speed = 18 + Math.random() * 55;
      particles.push({ x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, life: .4 + Math.random() * .6, color, size: Math.random() < .5 ? 2 : 3 });
    }
  }

  function updateMiniMap() {
    const w = miniCanvas.width, h = miniCanvas.height;
    miniCtx.clearRect(0,0,w,h);
    miniCtx.fillStyle = state.chapter === 1 ? '#315b3d' : state.chapter === 2 ? '#547b8e' : '#74402d'; miniCtx.fillRect(0,0,w,h);
    miniCtx.fillStyle = state.chapter === 1 ? '#927453' : state.chapter === 2 ? '#91aab4' : '#a55e3b';
    miniCtx.fillRect(w*.48, 0, 5, h); miniCtx.fillRect(0,h*.48,w,5);
    miniCtx.fillStyle = '#b8c2a5'; miniCtx.fillRect(w*.43,h*.42,18,15);
    miniCtx.fillStyle = '#e6d39a'; miniCtx.fillRect(w*.47,h*.48,5,5);
    for (const m of monsters) { const x = (m.x/1600)*w, y=(m.y/1600)*h; miniCtx.fillStyle='#ed7777'; miniCtx.fillRect(x,y,3,3); }
    miniCtx.fillStyle = '#fff4a8'; miniCtx.fillRect(state.x/1600*w-2,state.y/1600*h-2,5,5);
  }

  function openModal(name) {
    modalName = name;
    modalRoot.hidden = false;
    if (name === 'create') renderCreate();
    else if (name === 'menu') renderMenu();
    else if (name === 'bag') renderBag();
    else if (name === 'cultivation') renderCultivation();
    else if (name === 'quests') renderQuests();
    else if (name === 'market') renderMarket();
    else if (name === 'skills') renderSkills();
    else if (name === 'sect') renderSect();
    else if (name === 'zones' || name === 'map') renderZones();
    else if (name === 'settings') renderSettings();
    else if (name === 'achievements') renderAchievements();
    else if (name === 'npc') renderNPC();
  }

  function modalFrame(title, subtitle, content, actions = '') {
    modalRoot.innerHTML = `<section class="modal-card"><button class="modal-close" data-action="close" aria-label="Đóng">×</button><h2 class="modal-title">${title}</h2>${subtitle ? `<p class="modal-subtitle">${subtitle}</p>` : ''}<div class="modal-content">${content}</div>${actions ? `<div class="modal-actions">${actions}</div>` : ''}</section>`;
  }

  function renderCreate() {
    const gender = `<span class="field-label">Chọn giới tính</span><div class="gender-row"><button class="choice-card ${selectedGender==='male'?'selected':''}" data-gender="male"><div class="big">🧑🏻‍🗡️</div><strong>Nam</strong><small>Đạo tâm kiên định</small></button><button class="choice-card ${selectedGender==='female'?'selected':''}" data-gender="female"><div class="big">👩🏻‍🎤</div><strong>Nữ</strong><small>Linh căn thanh tú</small></button></div>`;
    const cards = CLASSES.map(c => `<button class="choice-card ${selectedClass===c.id?'selected':''}" data-class="${c.id}"><div class="big">${c.icon}</div><strong>${c.name}</strong><small>${c.desc}</small><small><b>${c.bonus}</b></small></button>`).join('');
    const content = `${gender}<label class="field-label" for="createName">Đạo hiệu</label><input class="input-field" id="createName" maxlength="14" placeholder="Nhập tên nhân vật" value="${escapeHtml(draftName)}"/><span class="field-label">Chọn con đường tu luyện</span><div class="class-grid">${cards}</div><p class="form-note">Mỗi hệ tu có kỹ năng, chỉ số và cách chiến đấu riêng. Có thể đổi cách chơi bằng cách tạo nhân vật mới trong cài đặt.</p>`;
    modalFrame('Khai mở tiên đồ', 'Tạo nhân vật • Chọn giới tính và một trong bảy hệ tu', content, `<button class="gold-button" data-action="create">Bắt đầu tu luyện</button>`);
  }

  function renderMenu() {
    const entries = [
      ['cultivation','☯','Tu luyện','Cảnh giới và đột phá'], ['bag','🎒','Túi trữ vật','Vật phẩm, dược liệu, pháp khí'],
      ['skills','✧','Công pháp','Kỹ năng và điểm thiên phú'], ['sect','🏯','Tông môn','Gia nhập một thế lực'],
      ['market','🪙','Thương hội','Mua bán và luyện đan'], ['quests','📜','Nhiệm vụ','Nhiệm vụ và phần thưởng'],
      ['zones','🌏','Bản đồ thế giới','Ba chương bản đồ'], ['settings','⚙','Cài đặt','Đồ họa và dữ liệu lưu']
    ];
    const content = `<div class="menu-grid">${entries.map(e=>`<button class="menu-tile" data-action="${e[0]}"><span>${e[1]}</span><div><strong>${e[2]}</strong><small>${e[3]}</small></div></button>`).join('')}</div><div class="stat-grid" style="margin-top:9px"><div class="stat-box"><small>Đồng</small><b>🪙 ${state.coins}</b></div><div class="stat-box"><small>Linh thạch</small><b>💎 ${state.stones}</b></div></div>`;
    modalFrame('Tiên Lộ • Menu', `${state.name} • ${REALMS[state.realmIndex]} ${state.realmStep}/9`, content);
  }

  function renderBag() {
    const entries = Object.entries(state.inventory).filter(([,qty])=>qty>0);
    const content = (entries.length ? entries.map(([id,qty])=>{
      const item=ITEMS[id]||{name:id,icon:'✧',type:'Vật phẩm',desc:''};
      return `<div class="item-row"><div class="item-icon">${item.icon}</div><div class="item-detail"><strong>${item.name} <span class="badge">${item.type}</span></strong><small>${item.desc}</small></div><b>×${qty}</b>${id==='herb'||id==='ore'||id==='core'||id==='silk'||id==='frost'||id==='ember'?`<button class="small-button" data-action="sell" data-item="${id}">Bán</button>`:''}${id==='pill'?`<button class="small-button" data-action="use-pill">Dùng</button>`:''}</div>`;
    }).join('') : `<div class="empty-state">Túi trữ vật đang trống.</div>`) + `<p class="footer-note">Tỷ lệ rơi pháp bảo tham khảo: Linh Khí 2,5–3,2% • Pháp Bảo 0,8–1,4% • Cổ Bảo 0,05–0,22% • Thông Thiên 0,04% • Tiên Khí 0,01% • Hỗn Độn 0,001%. Sinh lực và cấp độ cao giúp tăng nhẹ vận may rơi đồ.</p>`;
    modalFrame('Túi trữ vật', `Số loại vật phẩm: ${entries.length} • Linh thạch: ${state.stones}`, content, `<button class="purple-button" data-action="market">Đến thương hội</button>`);
  }

  function renderCultivation() {
    const realm = REALMS[state.realmIndex] || 'Đại Đạo';
    const cost = 10 + state.realmIndex * 6 + (state.realmStep > 6 ? 8 : 0);
    const next = state.realmStep === 9 ? (REALMS[state.realmIndex + 1] || 'Đại Đạo') + ' 1' : `${realm} ${state.realmStep + 1}`;
    const content = `<div class="stat-grid"><div class="stat-box"><small>Cảnh giới hiện tại</small><b>${realm} ${state.realmStep}/9</b></div><div class="stat-box"><small>Tu vi nhân vật</small><b>Cấp ${state.level}</b></div><div class="stat-box"><small>Linh khí</small><b>${Math.floor(state.qi)}/${state.qiMax}</b></div><div class="stat-box"><small>Đột phá kế tiếp</small><b>${next}</b></div></div><div style="margin:12px 0"><div class="progress-wide"><i style="width:${state.qi/state.qiMax*100}%"></i></div></div><p style="font-size:10px;color:#d2c4df;line-height:1.5">Ngồi thiền hấp thu linh khí. Khi linh khí viên mãn, dùng linh thạch hộ pháp để đột phá tiểu cảnh giới. Mỗi đại cảnh giới có 9 tiểu cảnh giới.</p><div class="stat-box"><small>Chi phí hộ pháp</small><b>💎 ${cost} linh thạch</b></div>`;
    modalFrame('Động phủ tu luyện', 'Tĩnh tâm ngưng khí • Vận chuyển chu thiên', content, `<button class="purple-button" data-action="meditate">Ngồi thiền + linh khí</button><button class="gold-button" data-action="breakthrough" ${state.qi<100?'disabled':''}>Đột phá cảnh giới</button>`);
  }

  function renderQuests() {
    const completed = state.questKills >= 3;
    const content = `<div class="data-card"><strong>📜 Nhiệm vụ tân thủ: Trừ yêu trong thôn</strong><small>Trưởng thôn nhờ ngươi tiêu diệt yêu thú đang quấy nhiễu linh điền.</small><div style="display:flex;justify-content:space-between;margin-top:10px;font-size:10px"><b>Tiến độ tiêu diệt</b><b style="color:#9df2bb">${Math.min(3,state.questKills)}/3</b></div><div class="progress-wide" style="margin-top:5px"><i style="width:${Math.min(100,state.questKills/3*100)}%"></i></div><div class="stat-grid" style="margin-top:9px"><div class="stat-box"><small>Phần thưởng</small><b>💎 60 linh thạch</b></div><div class="stat-box"><small>Kinh nghiệm</small><b>✨ 120 EXP</b></div></div></div><div class="data-card" style="margin-top:8px"><strong>⚔️ Nhiệm vụ săn yêu</strong><small>Tiêu diệt yêu thú trong khu vực để nhận EXP, đồng và nguyên liệu. Rơi vật phẩm tự động nhặt khi đến gần.</small></div>`;
    const action = state.questClaimed ? `<button class="purple-button" data-action="close">Đã nhận thưởng</button>` : `<button class="gold-button" data-action="claim-quest" ${!completed?'disabled':''}>${completed?'Nhận thưởng':'Chưa hoàn thành'}</button>`;
    modalFrame('Nhiệm vụ', 'Hành hiệp trừ yêu • Tích lũy công đức', content, action);
  }

  function renderMarket() {
    const products = [
      {id:'pill',name:'Tụ Khí Đan',icon:'🧪',desc:'Hồi 120 HP và 35 linh khí',price:22,currency:'stones'},
      {id:'herb',name:'Thanh Linh Thảo',icon:'🌿',desc:'Nguyên liệu luyện đan',price:5,currency:'coins'},
      {id:'ore',name:'Huyền Thiết',icon:'🪨',desc:'Nguyên liệu luyện khí',price:12,currency:'coins'},
      {id:'sword',name:'Thanh Phong Kiếm',icon:'🗡️',desc:'Phàm khí cơ bản, có thể bán lại',price:45,currency:'stones'},
      {id:'frost',name:'Hàn Tinh',icon:'❄️',desc:'Chỉ có hàng tại Băng Phong Cốc',price:55,currency:'stones',unlock:2},
      {id:'ember',name:'Hỏa Tinh',icon:'🔥',desc:'Chỉ có hàng tại Hỏa Vân Sơn',price:75,currency:'stones',unlock:3}
    ];
    const content = `<div class="stat-grid" style="margin-bottom:8px"><div class="stat-box"><small>Đồng</small><b>🪙 ${state.coins}</b></div><div class="stat-box"><small>Linh thạch</small><b>💎 ${state.stones}</b></div></div>${products.map(p=>`<div class="item-row"><div class="item-icon">${p.icon}</div><div class="item-detail"><strong>${p.name}</strong><small>${p.desc}</small></div><b style="font-size:10px">${p.price} ${p.currency==='stones'?'💎':'🪙'}</b><button class="small-button" data-action="buy" data-item="${p.id}" data-price="${p.price}" data-currency="${p.currency}" ${p.unlock&&state.chapter<p.unlock?'disabled':''}>Mua</button></div>`).join('')}<p class="footer-note">Đan tu nhận thêm 5% giá bán nguyên liệu khi giao dịch.</p>`;
    modalFrame('Vạn Bảo Lâu', 'Giao dịch tự do • Hàng hóa tùy khu vực', content);
  }

  function renderSkills() {
    const c = CLASS();
    const skills = [
      {name:c.skill,icon:c.glyph,desc:'Kỹ năng chủ động của hệ tu, gây sát thương hoặc hiệu ứng đặc biệt.',cost:22,unlocked:true},
      {name:'Ngự Khí Bộ',icon:'💨',desc:'Tăng tốc độ di chuyển trong thời gian ngắn.',cost:1,unlocked:state.level>=3},
      {name:'Hộ Thể Linh Thuẫn',icon:'🛡️',desc:'Tạo khiên giảm sát thương nhận vào.',cost:1,unlocked:state.level>=5},
      {name:'Tụ Linh Thuật',icon:'☯',desc:'Tăng lượng linh khí hấp thu khi ngồi thiền.',cost:1,unlocked:state.level>=8}
    ];
    const content = `<div class="stat-grid" style="margin-bottom:8px"><div class="stat-box"><small>Điểm kỹ năng</small><b>✧ ${state.skillPoints}</b></div><div class="stat-box"><small>Hệ tu</small><b>${c.name}</b></div></div><div class="skill-list">${skills.map((s,i)=>`<div class="data-card"><div style="font-size:23px">${s.icon}</div><strong>${s.name}</strong><small>${s.desc}</small><div style="margin-top:7px">${i===0?'<span class="badge">Đã lĩnh ngộ</span>':s.unlocked?'<span class="badge">Có thể lĩnh ngộ</span>':'<span class="badge">Mở ở cấp '+(i===1?3:i===2?5:8)+'</span>'}</div>${i>0?`<button class="small-button" style="margin-top:6px" data-action="learn-skill" data-index="${i}" ${!s.unlocked||state.skillPoints<1||state.unlockedSkills.includes(s.name)?'disabled':''}>${state.unlockedSkills.includes(s.name)?'Đã học':'Học • 1 điểm'}</button>`:''}</div>`).join('')}</div>`;
    modalFrame('Công pháp & kỹ năng', 'Mỗi hệ tu có tuyệt kỹ riêng biệt', content);
  }

  function renderSect() {
    const content = `<p style="font-size:10px;color:#d1c4df;line-height:1.5">Gia nhập tông môn để nhận phúc lợi và mở các hoạt động riêng. Chỉ được nhận một tông môn trong bản thử nghiệm.</p><div class="sect-grid">${SECTS.map(s=>`<div class="data-card"><div style="font-size:22px">${s.icon}</div><strong>${s.name}</strong><small>${s.type}</small><small>${s.desc}</small><div style="margin-top:5px"><span class="badge">${s.bonus}</span></div><button class="small-button" style="margin-top:7px" data-action="join-sect" data-sect="${escapeHtml(s.name)}" ${state.sect===s.name?'disabled':''}>${state.sect===s.name?'Đang gia nhập':'Gia nhập'}</button></div>`).join('')}</div>${state.sect?`<p class="footer-note">Đạo hữu hiện thuộc <b>${state.sect}</b>.</p>`:''}`;
    modalFrame('Tông môn thiên hạ', 'Chính đạo • Ma đạo • Trung lập', content);
  }

  function renderZones() {
    const content = `<div class="map-preview"><canvas id="largeMap" width="360" height="160"></canvas></div><div class="zone-grid" style="margin-top:9px">${ZONES.map(z=>`<div class="data-card"><strong>${z.name}</strong><small>${z.title}</small><small>${z.desc}</small><div style="margin:6px 0"><span class="badge">Cấp ${z.min}–${z.max}</span></div><button class="small-button" data-action="travel" data-zone="${z.id}" ${state.level<z.min?'disabled':''}>${state.chapter===z.id?'Đang ở đây':state.level<z.min?'Cần cấp '+z.min:'Truyền tống'}</button></div>`).join('')}</div><p class="footer-note">Khu vực mới mở khi đạt cấp yêu cầu. Tiến độ nhân vật được giữ nguyên khi đổi bản đồ.</p>`;
    modalFrame('Sơn hà bản đồ', 'Ba khu vực đầu tiên trong thế giới mở', content);
    drawLargeMap();
  }

  function drawLargeMap() {
    const map = $('#largeMap'); if (!map) return;
    const c = map.getContext('2d'); c.imageSmoothingEnabled = false;
    c.fillStyle = state.chapter===1?'#31583b':state.chapter===2?'#547e91':'#75402e'; c.fillRect(0,0,360,160);
    c.fillStyle = state.chapter===1?'#927451':state.chapter===2?'#9fb9c1':'#aa6038'; c.fillRect(169,0,20,160); c.fillRect(0,70,360,18);
    for(let i=0;i<35;i++){const x=(i*71)%360,y=(i*37)%160;c.fillStyle=i%2?'#47764c':'#79905a';c.fillRect(x,y,6,5);}
    c.fillStyle='#b5c8af';c.fillRect(150,61,60,42);c.fillStyle='#e8cf87';c.fillRect(176,77,8,8);
    c.fillStyle='#fff2a4';c.beginPath();c.arc(state.x/1600*360,state.y/1600*160,5,0,Math.PI*2);c.fill();
  }

  function renderSettings() {
    const content = `<div class="data-card"><strong>Đồ họa</strong><small>Chất lượng hiệu ứng trong game</small><div class="modal-actions"><button class="small-button" data-quality="low">Thấp</button><button class="small-button" data-quality="medium">Trung bình</button><button class="small-button" data-quality="high">Cao</button></div><p class="footer-note">Hiện tại: ${state.settings.quality==='high'?'Cao':state.settings.quality==='medium'?'Trung bình':'Thấp'}</p></div><div class="data-card" style="margin-top:8px"><strong>Hiệu ứng môi trường</strong><small>Tuyết, lá và hạt linh khí bay trong bản đồ.</small><button class="small-button" style="margin-top:7px" data-action="toggle-particles">${state.settings.particles?'Đang bật':'Đang tắt'}</button></div><div class="data-card" style="margin-top:8px"><strong>Dữ liệu tiến trình</strong><small>Tiến trình được lưu tự động trong trình duyệt trên thiết bị này.</small><button class="small-button" style="margin-top:7px" data-action="save-now">Lưu ngay</button><button class="small-button" style="margin:7px 0 0 5px;background:#74333c" data-action="reset-confirm">Xóa tiến trình</button></div><p class="footer-note">Bản thử nghiệm chạy offline sau khi tải trang; dữ liệu lưu trên từng trình duyệt, không đồng bộ tài khoản.</p>`;
    modalFrame('Cài đặt trò chơi', 'Tùy chỉnh trải nghiệm trên Android và iOS', content);
  }

  function renderAchievements() {
    const achieved = state.achievements.includes('first10');
    const content = `<div class="data-card"><strong>${achieved?'🏆':'🔒'} Bách chiến sơ thành</strong><small>Tiêu diệt 10 yêu thú bất kỳ.</small><span class="badge">${achieved?'Đã hoàn thành':'Tiến độ '+Math.min(10,state.totalKills)+'/10'}</span></div><div class="data-card" style="margin-top:7px"><strong>☯ Tĩnh tâm nhập định</strong><small>Ngồi thiền 10 lần.</small><span class="badge">${state.totalCultivations>=10?'Đã hoàn thành':state.totalCultivations+'/10'}</span></div><div class="stat-grid" style="margin-top:8px"><div class="stat-box"><small>Tổng yêu thú tiêu diệt</small><b>${state.totalKills}</b></div><div class="stat-box"><small>Số lần tu luyện</small><b>${state.totalCultivations}</b></div></div>`;
    modalFrame('Thành tựu', 'Ghi lại dấu chân trên con đường đại đạo', content);
  }

  function renderNPC() {
    const type = currentNpc?.type || 'elder';
    const title = currentNpc?.name || 'Đạo hữu';
    let body = '';
    if (type === 'elder') body = `<div class="data-card"><strong>Trưởng thôn</strong><small>“Yêu thú quanh linh điền ngày càng hung hãn. Đạo hữu có thể giúp thôn dân trừ yêu không?”</small></div><div class="modal-actions"><button class="purple-button" data-action="quests">Xem nhiệm vụ</button><button class="gold-button" data-action="travel" data-zone="1">Ở lại thôn</button></div>`;
    else if (type === 'alchemist') body = `<div class="data-card"><strong>Đan sư</strong><small>“Dược liệu tốt mới luyện được linh đan. Mang Thanh Linh Thảo đến đây, ta sẽ thu mua.”</small></div><button class="gold-button" data-action="sell" data-item="herb">Bán 1 Thanh Linh Thảo</button>`;
    else body = `<div class="data-card"><strong>Luyện khí sư</strong><small>“Huyền Thiết có thể rèn thành pháp khí. Hãy mang khoáng thạch trở lại khi đã thu thập đủ.”</small></div><button class="purple-button" data-action="market">Xem vật phẩm</button>`;
    modalFrame(title, 'Tương tác NPC', body);
  }

  let currentNpc = null;
  function interact() {
    const npcs = state.chapter === 1 ? [
      {x:790,y:625,name:'Trưởng thôn',type:'elder'}, {x:930,y:755,name:'Đan sư',type:'alchemist'}, {x:650,y:790,name:'Luyện khí sư',type:'smith'}
    ] : [{x:800,y:620,name:zone().name+' trưởng lão',type:'elder'}];
    const npc = npcs.map(n=>({...n,d:Math.hypot(n.x-state.x,n.y-state.y)})).sort((a,b)=>a.d-b.d)[0];
    if (!npc || npc.d > 110) { toast('Hãy đến gần NPC để tương tác.'); return; }
    currentNpc = npc; openModal('npc');
  }

  function changeZone(id) {
    const z = ZONES.find(z=>z.id===id); if (!z) return;
    if (state.level < z.min) { toast(`Cần đạt cấp ${z.min} mới được đến ${z.name}.`); return; }
    state.chapter = id; state.x = 800; state.y = 970; state.auto = false;
    currentTarget = null; moveTarget = null; monsters=[]; drops=[]; spawnMonsters(true);
    log(`Đã truyền tống đến ${z.name}.`, 'good');
    updateHUD(); saveGame(true); modalRoot.hidden=true; modalName=''; toast(`Đang ở ${z.name}`,2000);
  }

  function performAction(action, button) {
    switch(action) {
      case 'close': modalRoot.hidden=true; modalName=''; break;
      case 'create': createCharacter(); break;
      case 'menu': openModal('menu'); break;
      case 'map': case 'zones': openModal('zones'); break;
      case 'settings': openModal('settings'); break;
      case 'bag': openModal('bag'); break;
      case 'cultivation': openModal('cultivation'); break;
      case 'cultivate': case 'meditate': modalRoot.hidden=true; modalName=''; cultivate(); break;
      case 'breakthrough': breakthrough(); break;
      case 'quests': openModal('quests'); break;
      case 'market': openModal('market'); break;
      case 'skills': openModal('skills'); break;
      case 'sect': openModal('sect'); break;
      case 'achievements': openModal('achievements'); break;
      case 'attack': attack(); break;
      case 'skill': useSkill(); break;
      case 'pill': case 'use-pill': usePill(); if (modalName==='bag') renderBag(); break;
      case 'auto': state.auto=!state.auto; if(state.auto){currentTarget=nearestMonster(500);log('Tự động săn yêu đã bật.','good');}else log('Đã tắt tự động săn yêu.','system');updateHUD();saveGame();break;
      case 'interact': interact(); break;
      case 'travel': changeZone(Number(button.dataset.zone)); break;
      case 'claim-quest':
        if (state.questKills < 3 || state.questClaimed) { toast('Chưa đủ điều kiện nhận thưởng.'); break; }
        state.questClaimed=true; state.stones+=60; addXP(120); log('Hoàn thành nhiệm vụ tân thủ: +60 linh thạch, +120 EXP.','good'); updateHUD();saveGame(true);renderQuests();break;
      case 'sell': {
        const id=button.dataset.item; const qty=state.inventory[id]||0;
        if(!qty){toast('Không có vật phẩm để bán.');break;}
        const item=ITEMS[id]; const value=(item?.sell||2)*(state.classId==='alchemy'?1.05:1);
        consumeItem(id,1);state.stones+=Math.round(value);toast(`Đã bán ${item?.name||id}, nhận ${Math.round(value)} linh thạch.`);log(`Bán ${item?.name||id} lấy ${Math.round(value)} linh thạch.`,'loot');saveGame(); if(modalName==='bag')renderBag();else if(modalName==='market')renderMarket();else if(modalName==='npc')renderNPC();break;
      }
      case 'buy': {
        const id=button.dataset.item, price=Number(button.dataset.price), currency=button.dataset.currency;
        if(currency==='stones'&&state.stones<price||currency==='coins'&&state.coins<price){toast('Không đủ tài nguyên để mua.');break;}
        if(currency==='stones')state.stones-=price;else state.coins-=price;
        addItem(id,1);toast(`Đã mua ${ITEMS[id]?.name||id}.`);log(`Mua ${ITEMS[id]?.name||id}.`,'good');if(modalName==='market')renderMarket();break;
      }
      case 'join-sect':
        if(state.sect){toast('Bạn đã gia nhập một tông môn.');break;}
        state.sect=button.dataset.sect;state.stones=Math.max(0,state.stones-5);log(`Đã gia nhập ${state.sect}.`,'good');toast(`Chúc mừng! Bạn đã gia nhập ${state.sect}.`);saveGame();renderSect();break;
      case 'learn-skill': {
        const i=Number(button.dataset.index), names=['','Ngự Khí Bộ','Hộ Thể Linh Thuẫn','Tụ Linh Thuật']; const name=names[i];
        if(state.skillPoints<1||!name||state.unlockedSkills.includes(name)){toast('Không thể lĩnh ngộ kỹ năng này.');break;}
        state.skillPoints--;state.unlockedSkills.push(name);toast(`Đã lĩnh ngộ ${name}.`);saveGame();renderSkills();break;
      }
      case 'toggle-particles':state.settings.particles=!state.settings.particles;particles=[];saveGame();renderSettings();break;
      case 'save-now':saveGame(true);toast('Đã lưu tiến trình trên thiết bị.');break;
      case 'reset-confirm':modalFrame('Xóa tiến trình?', 'Hành động này không thể hoàn tác.', '<div class="data-card"><strong>Bạn có chắc muốn bắt đầu lại?</strong><small>Toàn bộ nhân vật, vật phẩm và tiến trình đã lưu trong trình duyệt sẽ bị xóa.</small></div>', '<button class="purple-button" data-action="settings">Quay lại</button><button class="gold-button" data-action="reset">Xóa dữ liệu</button>');break;
      case 'reset':localStorage.removeItem('tienlo_pixel_save_v1');state=deepClone(DEFAULT_STATE);monsters=[];drops=[];currentTarget=null;modalName='';selectedClass='sword';selectedGender='male';updateHUD();openModal('create');break;
    }
  }

  function setQuality(q) {
    state.settings.quality=q;
    if(q==='low'){dpr=Math.min(1,window.devicePixelRatio||1);}
    else if(q==='medium'){dpr=Math.min(1.5,window.devicePixelRatio||1);}
    else{dpr=Math.min(2,window.devicePixelRatio||1);}
    resize();saveGame();renderSettings();toast(`Đã đổi chất lượng đồ họa: ${q==='high'?'Cao':q==='medium'?'Trung bình':'Thấp'}`);
  }

  // Pointer controls: movement buttons remain held while a finger is on them.
  document.querySelectorAll('[data-dir]').forEach(btn => {
    const dir = btn.dataset.dir;
    btn.addEventListener('pointerdown', e => { e.preventDefault(); input[dir]=true; btn.setPointerCapture?.(e.pointerId); });
    const release = e => { input[dir]=false; };
    btn.addEventListener('pointerup', release); btn.addEventListener('pointercancel', release); btn.addEventListener('lostpointercapture', release);
  });
  window.addEventListener('pointerup', () => { input={up:false,down:false,left:false,right:false}; });
  window.addEventListener('keydown', e => {
    const key=e.key.toLowerCase();
    if(['arrowup','w'].includes(key)){input.up=true;e.preventDefault();}
    if(['arrowdown','s'].includes(key)){input.down=true;e.preventDefault();}
    if(['arrowleft','a'].includes(key)){input.left=true;e.preventDefault();}
    if(['arrowright','d'].includes(key)){input.right=true;e.preventDefault();}
    if(key===' '){attack();e.preventDefault();}
    if(key==='q'){useSkill();}
    if(key==='e'){interact();}
    if(key==='escape'&&!modalRoot.hidden){modalRoot.hidden=true;modalName='';}
  });
  window.addEventListener('keyup', e => {
    const key=e.key.toLowerCase();
    if(['arrowup','w'].includes(key))input.up=false;
    if(['arrowdown','s'].includes(key))input.down=false;
    if(['arrowleft','a'].includes(key))input.left=false;
    if(['arrowright','d'].includes(key))input.right=false;
  });

  document.addEventListener('click', e => {
    const genderBtn=e.target.closest('[data-gender]');
    if(genderBtn){draftName=$('#createName')?.value||draftName;selectedGender=genderBtn.dataset.gender;renderCreate();return;}
    const classBtn=e.target.closest('[data-class]');
    if(classBtn){draftName=$('#createName')?.value||draftName;selectedClass=classBtn.dataset.class;renderCreate();return;}
    const qBtn=e.target.closest('[data-quality]');
    if(qBtn){setQuality(qBtn.dataset.quality);return;}
    const actionBtn=e.target.closest('[data-action]');
    if(actionBtn){performAction(actionBtn.dataset.action,actionBtn);return;}
  });

  canvas.addEventListener('pointerdown', e => {
    if(modalName) return;
    const rect=canvas.getBoundingClientRect();
    const wx=camera.x+(e.clientX-rect.left), wy=camera.y+(e.clientY-rect.top);
    const mob=monsters.find(m=>Math.hypot(m.x-wx,m.y-wy)<48);
    if(mob){currentTarget=mob;state.targetId=mob.uid;targetFlash=.4;toast(`${currentMonsterDef(mob.chapter,mob.defId).name} • ${Math.ceil(mob.hp)}/${mob.hpMax} HP`);if(state.classId==='archer'||Math.hypot(mob.x-state.x,mob.y-state.y)<attackRange()+12)attack();else moveTarget={x:mob.x,y:mob.y};return;}
    const npcPositions=state.chapter===1?[{x:790,y:625},{x:930,y:755},{x:650,y:790}]:[{x:800,y:620}];
    const nearNpc=npcPositions.find(n=>Math.hypot(n.x-wx,n.y-wy)<48);
    if(nearNpc){moveTarget={x:nearNpc.x,y:nearNpc.y+35};return;}
    moveTarget={x:wx,y:wy};
  });

  modalRoot.addEventListener('click', e => {
    if(e.target===modalRoot){modalRoot.hidden=true;modalName='';}
  });
  modalRoot.addEventListener('input', e => { if(e.target && e.target.id === 'createName') draftName = e.target.value; });
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => { if(document.hidden)saveGame(true); });
  window.addEventListener('beforeunload', () => saveGame(true));

  function frame(now) {
    const dt=Math.min(.05,(now-lastFrame)/1000||0); lastFrame=now;
    if(state.created){update(dt);}
    else {elapsed+=dt;updateCamera(dt);}
    draw();
    requestAnimationFrame(frame);
  }

  // Boot sequence.
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('./sw.js').catch(err => console.warn('Offline cache unavailable:', err));
  }
  resize(); updateHUD();
  if(state.created){spawnMonsters(true);log(`Chào mừng trở lại, ${state.name}.`,'good');}
  else {spawnMonsters(true);openModal('create');}
  requestAnimationFrame(frame);
})();
