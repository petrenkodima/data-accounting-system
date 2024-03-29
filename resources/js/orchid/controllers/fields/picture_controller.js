import {Controller} from "stimulus";

export default class extends Controller {

    /**
     * @type {string[]}
     */

    static targets = [
        "source",
        "upload"
    ];

    /**
     *
     */
    connect() {
        let image = this.data.get('url') ? this.data.get('url') : this.data.get(`value`);

        if (image) {
            this.element.querySelector('.picture-preview').src = image;
            return;
        }

        this.element.querySelector('.picture-preview').classList.add('none');
        this.element.querySelector('.picture-remove').classList.add('none');
    }

    /**
     * Event for uploading image
     *
     * @param event
     */
    upload(event) {
        if (!event.target.files[0]) {
            return;
        }

        let maxFileSize = this.data.get('max-file-size');
        if (event.target.files[0].size / 1024 / 1024 > maxFileSize) {
            window.platform.alert('Ошибка проверки', `Размер загружаемого файла слишком велик. Максимальный размер: ${maxFileSize} MB`);
            event.target.value = null;
            return;
        }

        let reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);

        reader.onloadend = () => {
            const formData = new FormData();

            formData.append('file', event.target.files[0]);
            formData.append('storage', this.data.get('storage'));
            formData.append('group', this.data.get('groups'));

            let element = this.element;
            axios.post(platform.prefix('/systems/files'), formData)
                .then((response) => {
                    let image = response.data.url;
                    let targetValue = this.data.get('target');

                    element.querySelector('.picture-preview').src = image;
                    element.querySelector('.picture-preview').classList.remove('none');
                    element.querySelector('.picture-remove').classList.remove('none');
                    element.querySelector('.picture-path').value = response.data[targetValue];
                    $(element.querySelector('.modal')).modal('hide');
                })
                .catch((error) => {
                    window.platform.alert('Ошибка проверки', 'Ошибка загрузки файла');
                    console.warn(error);
                });
        };

    }

    /**
     *
     */
    clear() {
        this.element.querySelector('.picture-path').value = '';
        this.element.querySelector('.picture-preview').src = '';
        this.element.querySelector('.picture-preview').classList.add('none');
        this.element.querySelector('.picture-remove').classList.add('none');
    }
}
