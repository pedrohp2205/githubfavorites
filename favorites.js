import { GithubUser } from "./GithubUser.js"


export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
        this.onaddd()
    }

    load() {

        this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || []

    }

    save() {
        localStorage.setItem("@github-favorites:", JSON.stringify(this.entries))
    }

    async add(username) {
        try {

            const userExists = this.entries.find(entry => entry.login === username) 

            if(userExists) {
                throw new Error("Usuário já cadastrado")
            }

            const githubUser = await GithubUser.search(username)

            

            if (githubUser === undefined) {
                throw new Error("Usuario não encontrado")
            }  

            this.entries = [githubUser, ...this.entries]
            this.update()
            this.save()
        } catch(error) {
            alert(error.message)
        }
    }

    delete(user) {
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

        this.entries = filteredEntries
        this.update()
        this.save()
    }
}

export class FavoritesViews extends Favorites {
    constructor(root) {
        super(root)
        this.tbody = this.root.querySelector("table tbody")
        this.update()
    }

    onaddd() {
        const addButton = this.root.querySelector(".addFavorites")
        addButton.onclick = () => {
            const { value } = this.root.querySelector(".search input")

            this.add(value)

        }
    }

    update() {
        this.removeAllTr()

        this.entries.forEach(user => {
            const row = this.createRow()

            row.querySelector(".user img").src = `https://github.com/${user.login}.png`
            row.querySelector(".user a").href = `https://github.com/${user.login}`
            row.querySelector(".user p").textContent = user.name
            row.querySelector(".user span").textContent = user.login
            row.querySelector(".repositories").textContent =  user.public_repos
            row.querySelector(".followers").textContent = user.followers

            row.querySelector(".remove").onclick = () => {
                const isOk = confirm("Tem certeza que deseja deletar essa linha?")

                if (isOk) {
                    this.delete(user)
                }
            }


            this.tbody.append(row)

        })
        
    }

    createRow() {
        const tr = document.createElement("tr")

        tr.innerHTML = `        

            <td class="user">
                <img src="https://github.com/pedrohp2205.png" alt="Imagem de pedrohp2205">
                <a href="https://github.com/pedrohp2205" target="_blank">
                    <p>Pedro Menezes</p>
                    <span>pedrohp2205</span>
                </a>
            </td>
            <td class="repositories">
                76
            </td>
            <td class="followers">
                9589
            </td>
            <td>
                <button class="remove">Remover</button>
            </td>
        `

        return tr
    }

    removeAllTr() {


        this.tbody.querySelectorAll("tr").forEach(tr => {
            tr.remove()
        })
    }
}