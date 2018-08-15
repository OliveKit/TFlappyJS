class Brain {
	constructor(coeffs){
		this.input_nodes = 5;
		this.hidden_nodes = 4;
		this.ouput_nodes = 1;
		
		if (coeffs) {
			this.reformat(coeffs)
		} else {
			this.generate_coeffs();
		}
	}

	predict(input_array){
		return tf.tidy(() => {
			const inputs = tf.tensor2d(input_array, [5, 1]);
			const hidden = this.w_ih.dot(inputs).add(this.b_ih).relu(); // input => hidden
			const output = this.w_ho.dot(hidden).add(this.b_ho).sign(); // hidden => output
			
			return output;
		}).data();


		// const inputs = tf.tensor2d(input_array, [5, 1]);
		// const hidden = this.w_ih.dot(inputs).add(this.b_ih).relu(); // input => hidden
		// const output = this.w_ho.dot(hidden).add(this.b_ho).sign(); // hidden => output
		// inputs.dispose();
		// hidden.dispose();
		// const result = output.data();
		// output.dispose();

		// return result;
			

	}


	get coeffs(){
		return tf.concat([this.w_ih, this.b_ih, this.w_ho, this.b_ho]
				 .map(t => t.flatten())).data();
	}

	reformat(coeffs){
		// coeffs === 1D vector
		const coeffs_tf = tf.tensor1d([coeffs]);

		[this.w_ih, this.b_ih, this.w_ho, this.b_ho] = 
			tf.split(coeffs_tf,	[20, 4, 4, 1]);

		this.w_ih = this.w_ih.reshape([4, 5]);
		this.b_ih = this.b_ih.reshape([4, 1]);
		this.w_ho = this.w_ho.reshape([1, 4]);
		this.b_ho = this.b_ho.reshape([1, 1]);

	}
	
	generate_coeffs(){
		this.w_ih = tf.randomUniform([4, 5], -1, 1);
		this.b_ih = tf.randomUniform([4, 1], -1, 1);
		this.w_ho = tf.randomUniform([1, 4], -1, 1);
		this.b_ho = tf.randomUniform([1, 1], -1, 1);
	}

}









