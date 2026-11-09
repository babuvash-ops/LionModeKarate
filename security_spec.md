# Security Specification - DojoFlow

## 1. Data Invariants
- `Students`: Must have a unique ID, valid email, and belong to the dojo.
- `Classes`: Maximum capacity must be respected (enforced in UI, validated in rules).
- `AppSettings`: Only authorized administrators can modify global settings (hero images, school info).
- `Payments`: Student records must exist before a payment can be logged.

## 2. Relationships
- `Attendance` -> `Student` & `Class`
- `Membership` -> `Student`
- `Payments` -> `Student`

## 3. The "Dirty Dozen" Payloads (Red Team Test Cases)

| Payload ID | Target Collection | Action | Attack Type | Expected Result |
|------------|-------------------|--------|-------------|-----------------|
| P1 | `appSettings` | Update | Privilege Escalation | PERMISSION_DENIED (Non-admin) |
| P2 | `students` | Create | Schema Injection | PERMISSION_DENIED (Missing required fields) |
| P3 | `students` | Update | Identity Spoofing | PERMISSION_DENIED (Changing ownerId) |
| P4 | `classes` | Delete | Resource Poisoning | PERMISSION_DENIED (Unauthorized deletion) |
| P5 | `payments` | Create | Financial Fraud | PERMISSION_DENIED (Negative amount) |
| P6 | `attendance` | Create | Orphaned Write | PERMISSION_DENIED (Non-existent studentId) |
| P7 | `appSettings` | Get | Information Leak | PERMISSION_DENIED (Unauthenticated guest) |
| P8 | `students` | List | Data Scraping | PERMISSION_DENIED (Unauthenticated guest) |
| P9 | `classes` | Update | Capacity Overrun | PERMISSION_DENIED (Invalid capacity size) |
| P10 | `students` | Update | Note Tampering | PERMISSION_DENIED (Unauthorized user editing notes) |
| P11 | `memberships` | Create | State Shortcutting | PERMISSION_DENIED (Invalid start/end dates) |
| P12 | `global` | Any | Path Variable Injection | PERMISSION_DENIED (Malformed ID) |

## 4. Test Runner Location
Tests are implemented in `src/tests/firestore.rules.test.ts` (conceptual).
