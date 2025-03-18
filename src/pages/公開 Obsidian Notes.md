---
title: 公開 Obsidian Notes
category: 
tags:
  - 🅾️output
  - 🉑Public
created: 2025-03-18
last_updated: 2025-03-18
"related_files:": 相關筆記
references:
---
> [!NOTE] 想要將某些筆記發佈分享給別人，但其他筆記又想保有私密性；
> 並且懶得開兩個 repo 來管理的人 (就是我) 。

> 最簡單的方法其實就是開兩個 repo，一個公開一個不公開，要公開的時候再手動複製要公開的筆記 (但 GPT 說這個比較難 🫨?)
### 環境說明
- 原本的 vault 有同步至 GitHub ( Private Repository)
- 一個專門公開的 Public Repository
- 只公開 public 資料夾內的筆記
### 事前準備
- 基本的 GitHub 、GitHub Pages 、GitHub Actions 知識
- 一個放 vault 的 repo (Private/Public 均可)
- 一個準備推送的公開 repo (Only Public)
### 步驟
1. 在 Vault 中新增一個 public 資料夾 \
		- 這裡結構是 `庫的名字`/`其他不公開的筆記`、`public`
		<img src="Pasted%20image%2020250318174637.png" width="300px">
2. 建立一個放公開筆記的 GitHub repo
	[GitHub](https://github.com/)\
	- 記得選 Public \
	<img src="Pasted%20image%2020250318171209.png" width="300px">
3. 在剛剛新開的公開 repo 設定讀寫權限 \
	`settings` → `左側選單 Actions` → `General` → 找到 `Workflow permissions`
	<img src="Pasted%20image%2020250318173352.png" width="400px">
4. 在放 vault 的資料夾建立 yml 檔 `.github/workflows/deploy.yml`
	<img src="Pasted%20image%2020250318173800.png" width="300px">
5. 在 `deploy.yaml` 中設定 GitHub Actions 自動同步 public
	- 記得修改成你的庫的名稱 (例：PrivateNotes)
	- 要公開的資料夾名稱如果不一樣也要記得修改 (/public)
	- Git 使用者名稱及 Email 如果沒有出錯就不用設定
	- 最後在 git remote 加上公開 repo 的 web URL
	```yml
	name: Deploy Public Notes to GitHub Pages

	on:
	  push:
	    branches:
	      - main  # 只在 main 分支變更時觸發
	
	jobs:
	  deploy:
	    runs-on: ubuntu-latest
	    permissions: write-all  # 這一行確保 GITHUB_TOKEN 有寫入權限
	    steps:
	      - name: Checkout private repo
	        uses: actions/checkout@v3
	
	      - name: Copy public notes
	        run: |
	          mkdir -p ../public-repo
	          if [ -d "你的庫的名稱/public" ] && [ "$(ls -A ALittleCabin/public)" ]; then
	            cp -r 你的庫的名稱/public/* ../public-repo/
	          else
	            echo "⚠️ 你的庫的名稱/public/ directory is empty or missing! Skipping deployment."
	            exit 0 # 避免 Actions 因為空目錄而失敗
	          fi
	
	      - name: Set Git user identity
	        run: |
	          git config --global user.email "你的 Git 使用者 Email"
	          git config --global user.name "你的 Git 使用者名稱"
	          git config --global core.autocrlf false
	          git config --global core.quotepath false  # 避免 Unicode 檔名問題
	          git config --global init.defaultBranch main  # 預設 main 分支
	
	      - name: Push to public repo
	        env:
	          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}  # 設定環境變數，確保 GitHub Token 正確使用
	        run: |
	          cd ../public-repo
	          git init -b main # 直接用 main 避免分支名稱錯誤
	          git remote add origin https://x-access-token:${{ secrets.GITHUB_TOKEN }}@github.com/你的帳號/公開的 repo 名稱.git
	          git add .
	          git commit -m "Update public notes"
	          git push -f origin main
	```
6. 就可以到 GitHub Actions 查看是否執行成功囉!