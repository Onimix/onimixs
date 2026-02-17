# 📝 Input Format Examples - ONIMIX EAGLE EYE Pick

## 🎯 Historical Results Input Format

### Format Structure
```
Time,Result
HH:MM,TEAM1 H-A TEAM2
```

### ✅ Correct Examples

#### Example 1: Single Match
```
Time,Result
08:24,LEV 0-2 HSV
```

#### Example 2: Multiple Matches
```
Time,Result
08:24,LEV 0-2 HSV
08:24,MAI 4-0 SCF
09:15,BAY 3-1 DOR
10:30,MUN 2-2 BER
```

#### Example 3: Real Football Data
```
Time,Result
14:00,MAN UTD 2-1 CHE
14:00,LIV 3-0 ARS
16:30,BAR 4-2 REA
19:00,PSG 1-1 MAR
```

### 📋 Format Rules for Results

1. **Header Line**: Must include "Time" and "Result" (case-insensitive)
2. **Time Format**: HH:MM (24-hour format)
3. **Score Format**: `HOMETEAM H-A AWAYTEAM`
   - H = Home goals (number)
   - A = Away goals (number)
   - Use hyphen `-` between goals
4. **Team Names**: Can include spaces and abbreviations
5. **One match per line**

### ❌ Common Mistakes

**Wrong**: `08:24,LEV vs HSV 0-2` (team names after score)
**Correct**: `08:24,LEV 0-2 HSV`

**Wrong**: `08:24,LEV 0:2 HSV` (colon instead of hyphen)
**Correct**: `08:24,LEV 0-2 HSV`

**Wrong**: `08:24,LEV-HSV 0-2` (hyphen in team names)
**Correct**: `08:24,LEV 0-2 HSV`

---

## 🎲 Odds Input Format

### Format Structure
```
Time,Event,1,X,2,Goals,Over,Under
HH:MM,TEAM1 - TEAM2,odd1,oddX,odd2,goalLine,overOdd,underOdd
```

### ✅ Correct Examples

#### Example 1: Single Match
```
Time,Event,1,X,2,Goals,Over,Under
05:36,FCA - HDH,2.51,3.46,2.93,2.5,2.32,1.64
```

#### Example 2: Multiple Matches
```
Time,Event,1,X,2,Goals,Over,Under
05:36,FCA - HDH,2.51,3.46,2.93,2.5,2.32,1.64
06:00,BAY - DOR,1.85,3.60,4.20,2.5,1.95,1.85
07:30,MAN - CHE,2.10,3.40,3.50,2.5,2.05,1.75
```

#### Example 3: Real Betting Odds
```
Time,Event,1,X,2,Goals,Over,Under
14:00,MAN UTD - CHE,2.20,3.30,3.40,2.5,2.10,1.70
14:00,LIV - ARS,1.75,3.80,4.50,2.5,1.85,1.95
16:30,BAR - REA,1.50,4.20,6.50,2.5,1.65,2.20
19:00,PSG - MAR,1.90,3.50,4.00,2.5,2.00,1.80
```

### 📋 Format Rules for Odds

1. **Header Line**: Must include all 8 columns: Time,Event,1,X,2,Goals,Over,Under
2. **Time Format**: HH:MM (24-hour format)
3. **Event Format**: `HOMETEAM - AWAYTEAM`
   - Use space-hyphen-space ` - ` between teams
4. **Odds Values**: Decimal numbers (e.g., 2.51, 3.46)
5. **Goal Line**: Usually 2.5 (can be 1.5, 2.5, 3.5, etc.)
6. **One match per line**

### 📊 Column Meanings

| Column | Meaning | Example |
|--------|---------|---------|
| Time | Match time | 05:36 |
| Event | Home - Away teams | FCA - HDH |
| 1 | Home win odds | 2.51 |
| X | Draw odds | 3.46 |
| 2 | Away win odds | 2.93 |
| Goals | Goal line | 2.5 |
| Over | Over goal line odds | 2.32 |
| Under | Under goal line odds | 1.64 |

### ❌ Common Mistakes

**Wrong**: `05:36,FCA vs HDH,2.51,3.46,2.93,2.5,2.32,1.64` (vs instead of -)
**Correct**: `05:36,FCA - HDH,2.51,3.46,2.93,2.5,2.32,1.64`

**Wrong**: `05:36,FCA-HDH,2.51,3.46,2.93,2.5,2.32,1.64` (no spaces around -)
**Correct**: `05:36,FCA - HDH,2.51,3.46,2.93,2.5,2.32,1.64`

**Wrong**: `05:36,FCA - HDH,2,51,3,46,2,93,2,5,2,32,1,64` (comma as decimal separator)
**Correct**: `05:36,FCA - HDH,2.51,3.46,2.93,2.5,2.32,1.64`

---

## 🎬 Complete Workflow Example

### Step 1: Submit Historical Results

**Input:**
```
Time,Result
14:00,MAN UTD 2-1 CHE
14:00,LIV 3-0 ARS
16:30,BAR 4-2 REA
```

**Expected Response:**
```
✅ Successfully stored 3 results.
```

### Step 2: Submit Upcoming Odds

**Input:**
```
Time,Event,1,X,2,Goals,Over,Under
19:00,MAN UTD - LIV,2.20,3.30,3.40,2.5,2.10,1.70
19:00,BAR - REA,1.50,4.20,6.50,2.5,1.65,2.20
```

**Expected Response:**
```
✅ Successfully stored 2 odds and generated 2 predictions.
```

### Step 3: View Predictions

The predictions table will automatically show:
- Match details (teams, time)
- Expected goals
- Over 1.5 probability
- Over 2.5 probability
- Decision (LOCK 2+ GOALS / SAFE OVER 1.5 / AVOID)
- Confidence score

---

## 📱 Copy-Paste Ready Examples

### Quick Test - Results
```
Time,Result
08:24,LEV 0-2 HSV
08:24,MAI 4-0 SCF
09:15,BAY 3-1 DOR
```

### Quick Test - Odds
```
Time,Event,1,X,2,Goals,Over,Under
05:36,FCA - HDH,2.51,3.46,2.93,2.5,2.32,1.64
06:00,BAY - DOR,1.85,3.60,4.20,2.5,1.95,1.85
```

---

## 🔍 Validation Tips

### Results Input Checklist
- [ ] Header line present
- [ ] Time in HH:MM format
- [ ] Score format: TEAM H-A TEAM (with hyphen)
- [ ] Team names before and after score
- [ ] One match per line

### Odds Input Checklist
- [ ] Header line with all 8 columns
- [ ] Time in HH:MM format
- [ ] Event format: TEAM - TEAM (space-hyphen-space)
- [ ] All odds are decimal numbers
- [ ] Goal line is a number (usually 2.5)
- [ ] One match per line

---

## 💡 Pro Tips

1. **Copy from Excel/Sheets**: The CSV format works perfectly with spreadsheet exports
2. **Batch Processing**: You can submit multiple matches at once
3. **Historical Data**: Build up your database with past results for better predictions
4. **Consistent Format**: Always use the same format for reliable parsing
5. **Test First**: Try with 1-2 matches before submitting large batches

---

## 🐛 Troubleshooting

### "No valid results found in input"
- Check that you have the header line
- Verify score format uses hyphen: `0-2` not `0:2`
- Ensure team names are before and after the score

### "No valid odds found in input"
- Check that you have all 8 columns in header
- Verify event format uses ` - ` (space-hyphen-space)
- Ensure all odds are decimal numbers with dots, not commas

### "Failed to process"
- Check for special characters in team names
- Verify no extra commas in the data
- Ensure consistent line breaks (no blank lines in middle)

---

**Need more help?** Check the main [`README.md`](README.md) or [`QUICKSTART.md`](QUICKSTART.md)
