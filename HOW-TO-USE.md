# How to use Pocket

A walkthrough of everything Pocket can do, in the order you'll actually run into it. If something in the app looks unfamiliar, it's probably explained here.

## 1. Create your account

Go to `/register`, enter your name, email, and a password. You'll be logged in immediately and dropped on the Dashboard. Next time, `/login` with the same email/password. Your session stays logged in on this device until you log out.

## 2. The Dashboard

This is your home screen — a snapshot of today plus where your money is headed:

- **Earned today / Spent today** — today's income and expenses only.
- **Net this month** — total income minus total expenses, this calendar month.
- **Income vs. expenses** chart — the last 6 months, so you can see the trend, not just one month.
- **Spending by category** donut — where this month's expense money actually went.
- **Budgets** — your spending limits per category, if you've set any (see §5).
- **Goals + Suggestions** — progress on your savings goals and plain-language tips for reaching them faster.

Everything here updates automatically as you log transactions — there's nothing to "save" or "refresh."

## 3. Logging income and expenses

Go to **Transactions**. There are two sections: Income and Expenses. Both work the same way:

- **Amount** — type a number. As you type, a small line appears underneath showing it in plain language, like "≈ 40K dollars" (or "≈ 40M toman" if your currency is set to Iranian Rial — see §7; the Persian UI spells it out as "۴۰ میلیون تومان"). That's just a sanity check so a typo like an extra zero jumps out at you before you submit.
- **One-time vs. Recurring** — a one-time entry happens once, on the date you pick. A recurring entry (salary, rent, a subscription) repeats every month starting from that date, automatically, until you stop it.
- **Date** — click the date field to open a calendar. If your language is set to Persian, this shows a Jalali (Shamsi) calendar instead of the Gregorian one — pick dates however feels natural, the app handles the conversion.
- **Category** (expenses only) — pick from the fixed list (housing, food, dining, transport, entertainment, shopping, health, utilities, other).
- **Note** — optional, free text.

Once added, the entry shows up in the list below the form. Recurring entries are tagged **Recurring**; if one has been stopped, it's tagged **inactive** and shows the date range it was active for.

### Stopping a recurring entry

Recurring income or expenses don't end on their own — you tell Pocket when they stop:

- **Income**: click **Log a raise** next to an active recurring entry. This isn't just for raises — use it any time the amount changes (a pay cut works too). It closes out the old amount as of the date you pick and starts a new one, so your historical totals for past months stay accurate.
- **Expenses**: click **Stop** next to an active recurring expense (e.g. you canceled a subscription). It stops counting from that date forward but keeps the history.

Deleting (the trash icon) removes the entry entirely, including its history — use Stop/deactivate instead if you just want it to end going forward.

## 4. CSV import and export

At the top of the Income and Expenses sections there are **Export CSV** / **Import CSV** buttons.

- **Export** downloads everything in that section as a spreadsheet file — useful for backups or opening in Excel/Google Sheets.
- **Import** reads a CSV file and adds those rows as new entries. If you exported before, editing that same file and re-importing is the easiest way to bulk-add entries. If some rows have a problem (missing amount, invalid category, etc.), those specific rows are skipped and you're told how many — the rest still import fine.

## 5. Budgets

On the Dashboard, the **Budgets** card lets you set a monthly spending limit per category. Pick a category, type a limit, and a progress bar appears showing this month's spend against it — green while you're under it, amber past 80%, red once you've gone over. There's no penalty for going over, it's just a visual heads-up. Remove a budget with the × next to it any time.

## 6. Goals

Go to **Goals** to set a savings target — "Buy a car," "Emergency fund," whatever you're working toward.

- **Target amount** and an optional **target date**.
- Once created, click a goal to see its **projections** — four different estimates of when you'll get there, based on your last 6 months of income and spending:
  - **Average savings rate** — a straight average of your monthly net savings.
  - **Weighted recent-trend** — same idea, but your most recent months count for more, so a recent raise or a new expense shows up faster in the estimate.
  - **Best/worst case** — an optimistic and pessimistic date, based on how much your savings actually vary month to month.
  - **Category-cut suggestions** — looks at your discretionary spending (dining, entertainment, shopping) and estimates how much sooner you'd get there by trimming it 15%.
- The **Suggestions** panel turns those numbers into a sentence or two in plain English, e.g. *"At your current rate you'll hit this goal in 8 months. Cutting dining out by 15% gets you there in 6."*

### Sharing a goal

Next to a selected goal you'll see a small "Shared with" row. If you're the one who created the goal, you can invite someone else who already has a Pocket account by email — they'll then see the goal too, and their own projections toward it, calculated from their own income and expenses. **This isn't a joint bank balance** — you and a collaborator each track your own progress toward the same target, not a pooled amount. Only the goal's owner can invite, remove collaborators, edit, or delete the goal.

## 7. Language, currency, and theme

The sidebar has three switches:

- **Language** — English, فارسی (Persian), or Français. Switching to Persian also flips the whole layout right-to-left and switches the date picker to the Jalali calendar.
- **Currency** — USD, EUR, IRR, or JPY, just for how amounts are *displayed*. Everything is still stored in USD underneath, so switching currency never changes your actual numbers, only how they're shown. The IRR conversion rates are static approximations, not live — don't rely on them for anything time-sensitive.
- **Theme** — light or dark.

All three are saved on this device and stay set until you change them again.

## Quick troubleshooting

- **A category doesn't look right / a translation is missing** — categories are fixed to the nine built in; there's no way to add custom ones yet.
- **Amounts look off after switching currency** — remember the underlying numbers are always USD; the display conversion (especially IRR) is approximate.
- **A recurring entry is still being counted after I meant to stop it** — check whether you clicked Stop/Log a raise (which sets an end date) versus just leaving it running; only Stop/deactivate ends it going forward.
- **Import skipped some rows** — the summary tells you how many; the most common cause is a missing amount/date or a category name that's spelled differently from the fixed list.
