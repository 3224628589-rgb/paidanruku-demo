# Design QA

source visual truth path: `/Users/lfq/Desktop/paidanruku demo/figma-reference-1260-6317.png`

user annotation reference: `/var/folders/4x/5w_n1kx55p5c_r8b6gd5xqvw0000gn/T/codex-clipboard-2aaaa5d2-e982-441d-afe5-1c5a76812317.png`

implementation screenshots:
- `/Users/lfq/Desktop/paidanruku demo/density-photo-balanced.png`
- `/Users/lfq/Desktop/paidanruku demo/density-scan-hit.png`
- `/Users/lfq/Desktop/paidanruku demo/density-scan-hit-user-viewport.png`
- `/Users/lfq/Desktop/paidanruku demo/density-mobile-scan-hit.png`
- `/Users/lfq/Desktop/paidanruku demo/density-approve.png`
- `/Users/lfq/Desktop/paidanruku demo/density-mobile-photo-balanced.png`
- `/Users/lfq/Desktop/paidanruku demo/qa-photo-two-rows.png`
- `/Users/lfq/Desktop/paidanruku demo/qa-mobile-photo-two-rows.png`
- `/Users/lfq/Desktop/paidanruku demo/qa-approval-prompts-initial.png`
- `/Users/lfq/Desktop/paidanruku demo/qa-mobile-approval-prompts.png`
- `/Users/lfq/Desktop/paidanruku demo/qa-approval-drop-prompts.png`
- `/Users/lfq/Desktop/paidanruku demo/qa-progress-pages-final.png`
- `/Users/lfq/Desktop/paidanruku demo/qa-ready-submit-inbound.png`

viewport: desktop `1100 x 1050`, user-like desktop `1920 x 947`, narrow `430 x 900`, mobile `390 x 844`

state: photo captured, scan page with hit state, approve workbench loaded

**Findings**
- No actionable P0/P1/P2 findings after the balance pass.
- Follow-up overflow audit passed after fixing the dynamic scan hit state: `本次录入` and trace-code chips reported `0` card-boundary leaks on `1920 x 947` and `390 x 844`; receive list and bottom progress footer reported no overlap.
- Photo page result area audit passed: after 5 captures, all 5 thumbnails were visible across two rows on desktop and mobile.
- Approval bubble audit passed: the `待核准` bubble leaves the previous item in the top pending queue and selects the next item; the `准入库` bubble moves the current item out of the pending queue. Both target bottom cards received the drop impact animation class during the flight.
- Dynamic progress audit passed: after one photo, `待验货` changed `0 -> 4`; after one scan batch, `待验货` changed `4 -> 2`; after dropping one pending item into `准入库`, `准入库` changed `2 -> 3`, `待核准` changed `20 -> 19`, and the green/yellow progress segments resized accordingly.
- Progress page audit passed: status cards open in-page secondary views rather than modals. `准入库` shows purchase-order groups and line-level `查看核对详情`; the detail page renders the same approval snapshot table. `待验货` shows a receipt image summary and expanded OCR rows.
- Approval comparison audit passed: the extra `异常` tag in the field label column is removed; abnormal state remains visible through row/value styling only.
- Ready-submit audit passed: on the `准入库` secondary page, `提交入库` moved all 2 ready line rows into `已入库`, updated bottom counts from `0/2` to `2/0`, disabled the submit button, and left the secondary page in an empty state.

**Required Fidelity Surfaces**
- Fonts and typography: secondary section titles were removed or reduced; primary content labels, product names, counts, and action buttons remain readable without oversized low-value headers.
- Spacing and layout rhythm: photo and scan title bars were removed, camera frames now occupy the dominant vertical area, page gaps were reduced, and bottom progress aligns to the same width as the main content. The approve workbench now gives the central evidence/comparison area most of the height.
- Colors and visual tokens: bottom status colors follow the latest Figma node palette: cyan/blue for `已入库`, green for `准入库`, amber for `待核准`, slate for `待验货`.
- Image quality and asset fidelity: Figma status icons are rendered from downloaded SVG assets. Photo and trace-code images remain real image assets, not CSS placeholders.
- Copy and content: `随货同行单拍摄` and `追溯码识别` no longer consume standalone rows. Upload/simulate actions are attached to their camera frames.

**Patches Made**
- Moved photo upload and mock scan controls into the camera frames.
- Removed low-value camera title bars from photo and scan pages.
- Balanced the photo page so the viewfinder remains dominant while the captured-ticket row still has a complete readable thumbnail.
- Reduced the photo viewfinder height further and expanded the captured-ticket result tray to show two rows of thumbnails.
- Made bottom status cards equal-width with main content, larger, and readable; in tight space the count and label sit on one line.
- Made bottom status numbers and progress widths state-driven instead of hardcoded, including true zero-width segments for empty statuses.
- Increased bottom status color purity: brighter cyan/blue, green, amber, and cool slate fills/borders/rails.
- Changed status-card click behavior from modal detail to in-page secondary/tertiary pages that preserve the top step tabs and bottom progress cards.
- Added `待验货` receipt-image secondary page with supplier, line count, and OCR row details including image row number, product, spec, manufacturer, quantity, batch, unit price, and amount.
- Added approval-page floating action bubbles above `准入库` and `待核准`, wired them to physical drop animations into the matching bottom cards, and added jelly impact feedback on the target cards.
- Added `提交入库` on the `准入库` secondary page so all ready line rows can be batch-submitted into `已入库`.
- Reduced card nesting, padding, and borders across photo, scan, and approve pages.
- Compacted the receive list headers without shrinking the main scan/review content.
- Compacted approve queue, evidence card, comparison table, and decision area.
- Constrained trace-code chip text with inner ellipsis, prevented receive cards from shrinking inside the scroll list, and switched the receive list to content-height rows so dynamic scan rows stay inside their cards.
- On mobile, changed receive cards to stack product information above actions so product name, spec, approval tag, metadata, and `本次录入` do not fight for the same narrow row.
- Added the layout-density rule to `/Users/lfq/.codex/AGENTS.md`.

**Residual Notes**
- Browser console shows a favicon 404 from the static server only; no page script errors were observed.

final result: passed
